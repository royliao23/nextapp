// lib/api.js
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlcjgiLCJleHAiOjE3NTMwMTgwMjR9.H3x8yrNIEZy3RmV_dXzoxPJ85oT5Jb_fl2t6ElqSIS4";
if (!token) {
  throw new Error('No auth token found');
}
const headers = {
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
};
const uri = process.env.BACKEND_URL || 'http://localhost:8000';
export const fetchCompany = async () => {
  const response = await fetch(`${uri}/high/company/`, { headers });
  if (!response.ok) throw new Error('Error fetching company');
  return await response.json();
};

export const updateCompany = async (companyData) => {
  const response = await fetch(`${uri}/high/company/1/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(companyData)   
  });
  if (!response.ok) throw new Error('Error updating company');
  return await response.json();
};
