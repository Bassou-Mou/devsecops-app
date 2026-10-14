const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.json({message:'Hello DevSecOps', version: process.env.APP_VERSION ||'dev'});
})

app.get('/health', (req,res)=>res.status(200).send('OK'));
if (require.main === module) {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
}

module.exports = app;