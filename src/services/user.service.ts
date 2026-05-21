export const fetchUsers = () => {
  // Logic to interact with database would go here
  return [{ id: 1, name: 'John Doe' }];
};

export const createNewUser = (userData: { name: string }) => {
  // Logic to save user to database would go here
  return { id: Date.now(), ...userData };
};
