require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { JwtGenerator } = require('virgil-sdk');
const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner } = require('virgil-crypto');

const PORT = process.env.PORT || 8080;

const app = express();

async function getJwtGenerator() {
	await initCrypto();

	const virgilCrypto = new VirgilCrypto();
	
	return new JwtGenerator({
		appId: process.env.APP_ID,
		apiKeyId: process.env.APP_KEY_ID,
		apiKey: virgilCrypto.importPrivateKey(process.env.APP_KEY),
		accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto)
	});
}

const generatorPromise = getJwtGenerator();

const generateVirgilJwt = async (identity) => {
	const generator = await generatorPromise;
  const virgilJwtToken = generator.generateToken(identity);
  return virgilJwtToken.toString();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.post('/virgil-jwt', async (req, res) => {
  const virgilJwtToken = await generateVirgilJwt(req.body.identity);
  res.status(200).jsonp({ virgilToken: virgilJwtToken });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
