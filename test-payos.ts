import { AppDataSource } from './src/config/data-source.js';
import { User } from './src/models/user.entity.js';
import { MembershipPackage } from './src/models/membership-package.entity.js';
import { Customer } from './src/models/customer.entity.js';
import { CustomerSubscription } from './src/models/customer-subscription.entity.js';
import { Transaction } from './src/models/transaction.entity.js';
import payOS from './src/config/payos.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, '') // Keep alphanumeric and spaces
    .trim()
    .substring(0, 25);
};

async function testPayOSCheckout() {
  console.log('Initializing database connection...');
  await AppDataSource.initialize();
  console.log('Database initialized.');

  try {
    // 1. Get first available User
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: {} });
    if (!user) {
      console.error('No users found in database. Please register a user first.');
      return;
    }
    console.log(`Using User: ${user.full_name || user.email} (ID: ${user.id})`);

    // 2. Get Membership Package ID 7
    const packageRepository = AppDataSource.getRepository(MembershipPackage);
    const membershipPackage = await packageRepository.findOne({ where: { id: 7 } });
    if (!membershipPackage) {
      console.error('Membership package ID 7 not found in database.');
      return;
    }

    console.log(`Using Membership Package: "${membershipPackage.name}" (ID: ${membershipPackage.id}), Price: ${membershipPackage.price}`);

    // 3. Ensure Customer profile exists
    const customerRepository = AppDataSource.getRepository(Customer);
    let customer = await customerRepository.findOne({ where: { user_id: user.id } });
    if (!customer) {
      console.log('Customer profile not found. Creating one...');
      customer = customerRepository.create({ user_id: user.id });
      await customerRepository.save(customer);
    }

    // 4. Create a CustomerSubscription (pending status)
    const subscriptionRepository = AppDataSource.getRepository(CustomerSubscription);
    const subscription = subscriptionRepository.create({
      customer_id: customer.id,
      membership_id: membershipPackage.id,
      status: 'pending',
    });
    await subscriptionRepository.save(subscription);
    console.log(`Created pending subscription (ID: ${subscription.id})`);

    // 5. Create Transaction (pending status)
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const transaction = transactionRepository.create({
      customer_subscription_id: subscription.id,
      amount: Number(membershipPackage.price),
      payment_method: 'payOS',
      transaction_status: 'pending',
    });
    await transactionRepository.save(transaction);
    console.log(`Created pending transaction (ID: ${transaction.id})`);

    // 6. Request Payment Link from PayOS
    const orderCode = transaction.id;
    const cleanPackageName = cleanString(membershipPackage.name) || 'OmniGym Package';
    const cleanDesc = cleanString(`Thanh toan goi ${membershipPackage.id}`) || 'Thanh toan goi tap';

    console.log('Sending request to PayOS to generate payment link...');
    const paymentData = {
      orderCode,
      amount: Math.round(Number(membershipPackage.price)),
      description: cleanDesc,
      cancelUrl: process.env.PAYOS_CANCEL_URL || 'http://localhost:5173/payment/cancel',
      returnUrl: process.env.PAYOS_RETURN_URL || 'http://localhost:5173/payment/success',
      items: [
        {
          name: cleanPackageName,
          quantity: 1,
          price: Math.round(Number(membershipPackage.price)),
        },
      ],
    };

    const paymentLinkResponse = await payOS.paymentRequests.create(paymentData);

    // Save payment details back to transaction
    transaction.checkout_url = paymentLinkResponse.checkoutUrl;
    transaction.payment_link_id = paymentLinkResponse.paymentLinkId;
    await transactionRepository.save(transaction);

    console.log('\n======================================================');
    console.log('PAYOS PAYMENT LINK GENERATED SUCCESSFULLY!');
    console.log('======================================================');
    console.log(`Order Code      : ${orderCode}`);
    console.log(`Amount          : ${paymentLinkResponse.amount} VND`);
    console.log(`Checkout URL    : ${paymentLinkResponse.checkoutUrl}`);
    console.log('======================================================\n');
    console.log('You can open the Checkout URL in your browser to view the PayOS payment page and QR Code.');

  } catch (error: any) {
    console.error('Error during payment generation:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

testPayOSCheckout();
