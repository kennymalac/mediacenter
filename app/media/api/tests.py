import string
import random

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase
from channels import Channel
from channels.test import ChannelTestCase

from api.models import Account, ActivityLog, Log, BlogPost

api_request = APIRequestFactory()


def gen_random_string(n):
    return ''.join(random.SystemRandom().choice(string.ascii_lowercase + string.digits) for _ in range(n))


# TODO: separate endpoint tests from the tests describing mainly model
# functionality

class ChannelTests(ChannelTestCase):

    def test_chat_stream(self):
        # Test Chat socket setup and stream messages between multiple users
        Channel("some-chat-stream").send({"message": ""})

    def test_chat_valid_auth(self):
        # Make sure an anonymous user can only chat as anonymous with a
        # nickname
        pass

    def test_serialize_chat_history(self):
        # Make sure a chat history logs correctly
        # TODO: encrypt chat history
        pass


class AuthTests(APITestCase):

    def test_create_account(self):
        # Creating an account should return a valid JWT token
        # Create a CREATE request with registration JSON
        data = {
            'username': 'test' + gen_random_string(5),
            'password': gen_random_string(10),
            'full_name': 'John D. Smith',
            'country': 'US',
        }
        create_request = factory.post('/account/create', data, format='json')
        # TODO: test for register throttle
        # response = AccountCreate.
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual()

        new_user = Account.objects.get()
        # Password must be encrypted
        self.assertNotEqual(new_user.password, data['password'])
        # All fields should be the same
        self.assertEqual(new_user.name, data['name'])
        self.assertEqual(new_user.country.name, 'United States')
        self.assertEqual(new_user.email, data['email'])
        self.assertEqual(new_user.fullname, data['full_name'])
        self.assertEqual(Account.objects.count(), 1)

    def test_create_account_missing_fields(self):
        # Creating an account with missing fields should result
        # in a list of returned errors in the JSON
        data = {
            'country': 'US',
        }

        create_request = factory.post('/account/create', data, format='json')
        # view =
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # self.assertEqual

    def test_create_account_already_exists(self):
        # Creating an account that already exists results in an error
        existing_account = Account(
            username='hey', fullname=';)', password='testing')
        existing_account.save()

        data = {
            'fullname': ':O',
            'username': 'hey',
            'password': 'testing'
        }

        create_request = factory.post('/account/create', data, format='json')

        # view =
        response = view(request)
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        # verify existing account was not overwritten
        self.assertNotEqual(Account.objects.get().fullname,
                            ':O')

    def test_change_user_settings(self):
        # A newly registered user should be able to change profile information
        existing_account = Account(
            username='newuser', fullname='newuser', password='testing')
        existing_account.save()
        data = {
             
        }
        request = factory.put('/account/settings', data, format='json')
        request.user = existing_account

        self.assertJSONEqual(existing_account.user_settings, request.data)

    def test_delete_account(self):
        exiting_account = Account(
            username='newuser', fullname='newuser', password='testing')
        existing_account.save()
        existing_id = 4

        data = {
            
        }
        request = factory.delete('/account/')

    def test_join_chat_stream(self):
        # Test an active connection over a channel
        pass


class ActivityLogTests(APITestCase):

    def test_create_activity_log(self):
        data = {
            'username': 'test' + gen_random_string(5),
            'password': gen_random_string(10),
            'full_name': 'John D. Smith',
            'country': 'US',
        }
        create_request = factory.post('/account/create', data, format='json')
        create_request.force_authenticate()
        # response = AccountCreate.
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual()

        new_activity_log = Account.objects.get()
        # Password must be encrypted
        self.assertEqual(new_activity_log.title, data['title'])
        self.assertEqual(new_activity_log.authors, data['authors'])
        self.assertEqual(new_activity_log.logs.length, 0)

    def test_update_activity_log(self):
        # Using an activitylog, we would like to modify its settings
        data = {
            
        }
        update_request = factory.update('/account/', data, format='json')
        update_request.force_authenticate()
        response = view(request)
        self.assertEqual()

    def test_add_activity_logs(self):
        # We should be able to add logs to an ActivityLog instance
        #Log
        pass

    def test_temp_delete_activity_log(self):
        # We shoudl be able to remove activity logs
        pass

    def test_serialize_activity_log(self):
        pass


class AccountModerationTests(TestCase):
    # TODO: a better moderation system
    pass


class LogTests(TestCase):

    def test_create_log(self):
        pass

    def test_immutability(self):
        # Make sure that Logs are immutable and a new log is created
        # if a modification etc. is being made
        pass

    def test_temp_delete_log(self):
        # Logs are temporal but we don't want to keep them indefinitely
        # However, they should still be deleted eventually
        pass


class BlogTests(TestCase):

    def test_create_post(self):
        data = {
            'title': '',
            'slug': '',
            'authors': [1,]
        }

        create_request = factory.post('/account/create', data, format='json')
        create_request.force_authenticate()
        # response = AccountCreate.
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual()

        new_blog_post = Account.objects.get()
        # Password must be encrypted
        self.assertEqual(new_activity_log.title, data['title'])
        self.assertEqual(new_activity_log.authors, data['authors'])
        self.assertEqual(new_activity_log.logs.length, 0)

    def test_slug_is_unique(self):
        existing_post = BlogPost()
        existing_post.save()

    def test_post_to_activity_log(self):
        # Assert that a blogpost can be attached to an ActivityLog
        pass

    def test_modify_settings(self):
        pass

    def test_view_permissions(self):
        # Users who are not permitted to view certain posts should be blocked
        # A 404 response from the API should also be default
        pass


class MediaTests(TestCase):

    def test_upload_photo(self):
        data = {

        }

    def test_upload_multiple_photos(self):
        pass

    def test_update_photo_tags(self):
        pass

    def test_update_photo(self):
        pass

    def test_serialize_album(self):
        pass

    def test_serialize_multiple_albums(self):
        pass

    def test_serialize_media_entry(self):
        pass

    def test_view_permissions(self):
        pass
