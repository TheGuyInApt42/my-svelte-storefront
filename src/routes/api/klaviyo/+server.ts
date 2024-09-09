import { json } from '@sveltejs/kit';
import { ApiKeySession, ListsApi, ProfilesApi, SubscriptionCreateJobCreateQuery } from 'klaviyo-api';
import { KLAVIYO_LIST_ID } from '$env/static/private';
import { KLAVIYO_API_KEY } from '$env/static/private';


const apiKey = KLAVIYO_API_KEY;
const listId = KLAVIYO_LIST_ID
const privateKey = 'pk_b7bbd6f4bec5178ffe26745a0614b2d6bb';

const session = new ApiKeySession(privateKey);
//const listsApi = new ListsApi(session);
const profilesApi = new ProfilesApi(session);

export async function POST({ request }) {
  try {
    const data = await request.json();
    const email = data.email;

    if (!email) {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    /* const listMembersAddQuery = {
      data: {
        type: 'list',
        attributes: {
          profiles: [{ email: email }]
        }
      }
    }; */

    const subscriptionCreateJobCreateQuery: SubscriptionCreateJobCreateQuery = {
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email: email
                }
              }
            ],
            historical_import: false
          },
          relationships: { list: { data: { type: 'list', id: listId } } }
        }
      }
    };

    // Await the response from the API call
    //const response = await listsApi.createListRelationships(listId, listMembersAddQuery);

    const response = await profilesApi.subscribeProfiles(subscriptionCreateJobCreateQuery);

    // Handle successful subscription
    return json({ success: true, data: response }, { status: 200 });
  } catch (error) {
    // Handle errors
    console.error('Error subscribing profile:', {
      message: error.message,
      response: error.response?.data || 'No response data',
      stack: error.stack
    });
    return json({ success: false, error: 'An error occurred while subscribing' }, { status: 500 });
  }
}
