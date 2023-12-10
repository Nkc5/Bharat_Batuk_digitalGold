

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const baseUrl = process.env.base_URL;
const partner_id = process.env.partner_id;


class securityMmtc {

//  login
 static login =  async function (req, res) {

 if(!partner_id){
    return res.status(401).json("Unauthorized");
  }

  
    try {
        
    const response = await axios.post(`${baseUrl}/security/login`,null, {
        headers: {
            'Accept': 'application/json',
            'partner_id': partner_id,
            'Authorization': 'Basic YmhhcmF0X2JhdHVrOmJoYXJhdF9iYXR1aw=='
    }})

    // session = response.data
    // console.log(session)

    return  response.data;


    } catch (error) {
        res.status(error.response.status).json(error);
    }
}




// logout

static logout = async (req, res) =>{
  const session = await this.login(req, res);
 
  
    try {
        const response = await axios.post(`${baseUrl}/security/logout`,null, {
          headers: {
            'Accept': 'application/json',
            'Cookie': `sessionId=${session.sessionId}` 
      }})
  
      res.json(response.data);
     
      } catch (error) {
          res.status(error.response.status).json(error);
      }
  }
  



}

module.exports = securityMmtc;