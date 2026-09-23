import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    }

    const currency = '$';

    const months = ['', 'January', 'February', 'March', 'Apr', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('-');
        return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2];
    }


    const value = { calculateAge, slotDateFormat, currency };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;