import { json } from '@sveltejs/kit';
import { KLAVIYO_LIST_ID } from '$env/static/private';
import { KLAVIYO_API_KEY } from '$env/static/private';
import { KLAVIYO_PRIVATE_KEY } from '$env/static/private';

export async function POST({ request }) {
  const { email } = await request.json();

  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  const apiKey = KLAVIYO_API_KEY;
  const listId = KLAVIYO_LIST_ID;
  const privateKey = KLAVIYO_PRIVATE_KEY;

  const info = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: {
                email: email,
                subscriptions: {
                  email: {
                    marketing: {
                      consent: "SUBSCRIBED"
                    }
                  }
                }
              },
             
            }
          ]
        },
        custom_source: 'website form',
        historical_import: false
      },
      relationships: {
        list: {
          data: {
            type: 'list',
            id: listId
          }
        }
      }
    }
  }

  /*   try {
    const response = await fetch(`https://a.klaviyo.com/api/v2/list/${listId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Klaviyo-API-Key ${apiKey}`
      },
      body: JSON.stringify({
        profiles: [{ email }]
      })
    });

    console.log(await response.json());

    if (response.ok) {
      return json(
        { success: 'You have successfully subscribed to our newsletter' },
        { status: 200 }
      );
    } else {
      const error = await response.json();
      return json(
        { error: error.error || 'An error occurred while subscribing' },
        { status: response.status }
      );
    }
  } catch (error) {
    return json({ error: 'An error occurred while subscribing' }, { status: 500 });
  }
} */

  try {
    const url = `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: '2024-07-15',
        'content-type': 'application/json',
        Authorization: `Klaviyo-API-Key ${privateKey}`
      },
      body: JSON.stringify(info)
    };

    const response = await fetch(url, options);
    // Log the response status and headers
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    // Try to get the response text
    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Handle the case where response text is empty
    if (responseText.trim() === '') {
      return json({ success: true, message: 'Request accepted but no additional information provided.' }, { status: response.status });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return json({ success: false, error: 'Invalid JSON response from API' }, { status: 500 });
    }

    if (response.ok) {
      return json({ success: true, data: result });
    } else {
      return json({ success: false, error: result }, { status: response.status });
    }
  } catch (error) {
    console.error('Bulk subscribe error:', error);
    return json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}
