

const express = express();
const router = express.Router();

const createUserAccount = require('../../controllers/augmont_api/create_user.js')



router.post('create-user-account', createUserAccount);



module.exports = router;