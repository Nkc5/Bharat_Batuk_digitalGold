const axios = require('axios');



const products = async (req, res) =>{


  
    console.log("in create lender")
 
    // const data=
    // {
    //     "name" : "Shety",
    //     "pan" : "AAAAA2345B",
    //     "dob" : "1992-10-12",
    //     "mobile" : "9090909090",
    //     "email" : "email@gmail.com",
    //     "businessType":"INDIVIDUAL",
    //     "addresses" : [
    //       {
    //         "houseNumber" : "123",
    //         "area" : "ABC Layout",
    //         "city" : "XYZ City",
    //         "state" : "Karnataka",
    //         "pin" : 111111
    //       }
    //     ],
    //     "nominees" : [
    //       {
    //         "relation" : "PARENT",
    //         "name" : "Robert Jonas",
    //         "emailId" : "dummy@gmail.com",
    //         "phoneNumber" : "9090909090",
    //         "address" : "123, ABC Layout, XYZ City, PIN: 111111",
    //         "isMinor":false
    //       }
    //     ],
    //     "bankDetails" : [
    //       {
    //         "accountHolderName" : "Nick Jonas",
    //         "accountType" : "saving",
    //         "accountNumber" : "453653463545",
    //         "ifscCode" : "HDFC00023",
    //         "bankName" : "HDFC Bank",
    //         "branch" : "RR NAGAR",
    //         "city" : "Bangalore"
    //       }
    //     ]
    //   }

      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'PjiC4OgJR459ItUfcBGOlWHKbzemSnM2mU6ztZ18',
        'partner-code': "BHA324"

      }
      const params={
        'type':'LENDER'
      }


      try {
       
      const response = axios.post('https://uatapis.finzy.com/v1/products?type=LENDER',  {
        params:params,
        headers: headers
      })

      console.log("response", response.data);
      return res.status(200).json(response.data);
    
       
    } catch (error) {
        console.log("error", error);
        return res.status(400).json(error);   
    }
}



module.exports = products;