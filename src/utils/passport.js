import metadata from 'gcp-metadata';
import {OAuth2Client} from 'google-auth-library';

const oAuth2Client = new OAuth2Client();

// Cache externally fetched information for future invocations
let aud;

async function audience() {
  if (!aud && (await metadata.isAvailable())) {
    let project_number = await metadata.project('numeric-project-id');
    let project_id = await metadata.project('project-id');

    aud = '/projects/' + project_number + '/apps/' + project_id;
  }

  return aud;
}

async function validateAssertion(assertion) {
  if (!assertion) {
    return {};
  }

  const aud = await audience();
  console.log(`AUD: %${aud}`)

  const response = await oAuth2Client.getIapPublicKeys();
  console.log(`RESPONSE: ${response.res}   ...:${response.pubkeys}`)
  const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
    assertion,
    response.pubkeys,
    aud,
    ['https://cloud.google.com/iap']
  );
  const payload = ticket.getPayload();

  return {
    email: payload.email,
    sub: payload.sub,
  };
}




export default validateAssertion;