import { useState, useEffect } from "react";
import supabase from "../src/config/supabaseClient.jsx";
import Emoji from "./Emoji.jsx";
import "./App.css";

function App() {
  // State to store the contacts and the new contact input value
  const [contacts, setContacts] = useState([]); 
  const [newFname, setNewFname] = useState(""); 
  const [newLname, setNewLname] = useState(""); 
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState(""); 
  const [formError, setFormError] = useState(null);
  const [search, setSearch] = useState("");


  // UseEffect hook to run fetchContacts function when the component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Define a fetchContacts function
  const fetchContacts = async () => {
    const { data,error } = await supabase.from("contacts").select();
    if (error) {
      console.log(error);
    }
    setContacts(data);
  };

  // Define an addContact function
  const addContact = async (e) => {
    e.preventDefault();

    if (!newFname || !newLname || !newPhone || !newEmail) {
      setFormError("All fields are required");
      return;
    }

    const { error } = await supabase.from("contacts").insert([{
      fname: newFname,
      lname: newLname,
      phone_no: newPhone,
      email: newEmail
      }]);

    if (error) {
      setFormError("Failed to add contact");
      console.log(error);
      return;
    }
    fetchContacts();
    setNewFname("");
    setNewLname("");
    setNewPhone("");
    setNewEmail("");
    setFormError(null);
  };
    

  // Define a deleteContact function
  const deleteContact = async (contactId) => {
    const { error } = await supabase.from("contacts").delete().eq("id",contactId);
    if (error)
    console.log(error);
    setContacts(contacts.filter((contact) => contact.id !==contactId));
  };

  return (
    <div className="App">
      <h1>Contacts App</h1>
      <h2>Create New Contact</h2>
      <div className="contacts-container">
        <input
          type="text"
          placeholder="First name"
          value={newFname}
          onChange={(e) => setNewFname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last name"
          value={newLname}
          onChange={(e) => setNewLname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button className="addContact" onClick={addContact}>Add Contact</button>
        {formError && <p className="error">{formError}</p>}

          <input
            className="search"
            type="text"
            placeholder="Search contact"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        <ul>
          {contacts.filter((contact) => {
            return search.toLowerCase() === "" ? contact : contact.fname.toLowerCase().includes(search)
          }).map((contact) => (
            <li key={contact.id}>
              <h3>{`${contact.fname} ${contact.lname}`}</h3>
              <span className="phone">
              <Emoji symbol="🕾  " />{contact.phone_no}
              </span>
              <span className="email">
              <Emoji symbol="🖂  " />{contact.email}
              </span>
              <button className="delete" onClick={() => deleteContact(contact.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

