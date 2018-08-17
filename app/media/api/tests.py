import string
import random

import logging
logger = logging.getLogger(__name__)

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from channels import Channel
from channels.tests import ChannelTestCase

from api.models import Account, Profile, ActivityLog, BlogPost, Interest, Place, PlaceRestriction, Feed, FeedContentItem, FeedContentItemType, FeedContentStash, Discussion, Link, GroupForum

api_request = APIRequestFactory()


def gen_random_string(n):
    return ''.join(random.SystemRandom().choice(string.ascii_lowercase + string.digits) for _ in range(n))


def make_content_types():
    for ctype in FeedContentItemType.CONTENT_TYPES:
        FeedContentItemType.objects.get_or_create(name=ctype[1])

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
        create_request = api_request.post('/account/create', data, format='json')
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

        create_request = api_request.post('/account/create', data, format='json')
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

        create_request = api_request.post('/account/create', data, format='json')

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
        request = api_request.put('/account/settings', data, format='json')
        request.user = existing_account

        self.assertJSONEqual(existing_account.user_settings, request.data)

    def test_delete_account(self):
        exiting_account = Account(
            username='newuser', fullname='newuser', password='testing')
        existing_account.save()
        existing_id = 4

        data = {
            
        }
        request = api_request.delete('/account/')

    def test_join_chat_stream(self):
        # Test an active connection over a channel
        pass


def make_random_user():
    user = Account(
        username='test' + gen_random_string(5),
        password=gen_random_string(10)
    )
    user.save()
    return user


class ActivityLogTests(APITestCase):
    # def setUp(self):
    #     super(self).setUp()

    def test_create_activity_log(self):
        user = make_random_user()

        data = {
            'full_name': 'John D. Smith',
            'country': 'US'
        }
        create_request = api_request.post('/account/create', data, format='json')
        force_authenticate(create_request, user)
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
        update_request = api_request.patch('/account/', data, format='json')
        force_authenticate(update_request, user)
        response = view(request)
        #self.assertEqual()

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

        create_request = api_request.post('/account/create', data, format='json')
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
        # Accounts who are not permitted to view certain posts should be blocked
        # A 404 response from the API should also be default
        pass


class MediaTests(APITestCase):
    def setUp(self):
        self.user = make_random_user()

    # def permissionsCheck(self):
    # TODO: better permissions testing
    #     pass

    def test_upload_photo(self):
        # TODO get base64 for a test photo
        image = ""

        data = {
            'photo': {
                'data': base64.encode(image)
            }
        }
        create_request = api_request.post('/media/create', data, format='json')
        force_authenticate(create_request, self.user)

    def test_upload_multiple_photos(self):
        album = Album()
        album.save()
        data = {
            album: album.id
        }

        create_request = api_request.post('/media/create', data, format='json')
        force_authenticate(create_request, self.user)


    def test_update_photo_tags(self):
        photo = Media(media_type='P')
        photo.save()

        data = {
            'photo': photo.id,
            'tags': ['','']
        }
        update_request = api_request.patch('/media/', data, format='json')
        force_authenticate(update_request, self.user)

    def test_update_photo(self):
        photo = Media(media_type='P')
        photo.save()

        data = {
            
        }
        update_request = api_request.patch('/', data, format='json')
        force_authenticate(update_request, self.user)

    def test_upload_video(self):
        video = Media(media_type='V')
        video.save()

        data = {
            
        }
        create_request = api_request.post('/media/create', data, format='json')
        force_authenticate(create_request, self.user)
        #

    def test_upload_multiple_videos(self):
        data = {
            
        }
        create_request = api_request.post('/media/create', data, format='json')
        force_authenticate(create_request, self.user)
        #

    def test_upload_many_media(self):
        """Uploading both videos and photos"""
        data = {
            
        }
        create_request = api_request.post('/media/create', data, format='json')
        force_authenticate(create_request, self.user)

    def test_serialize_album(self):
        data = {
            
        }

        get_request = api_request.get('', data, format='json')
        force_authenticate(get_request, self.user)


    def test_serialize_multiple_albums(self):
        multiple_album_request_data = {
            
        }

        get_request = api_request.get('', data, format='json')
        force_authenticate(get_request, self.user)

    def test_serialize_media_entry(self):
        data_to_be_serialized = {
            
        }

        get_request = api_request.get('', data)
        force_authenticate(get_request, self.user)


    def test_view_permissions(self):
        # Make sure guests can only view public media
        media_request_data = {
            
        }

        # Make sure guests can only view public album metadata
        album_request_data = {
            
        }


class FeedPermissionsTests(APITestCase):
    def setUp(self):
        self.user = make_random_user()
        self.feed_data = dict(
            owner=self.user,
            name="Example feed"
        )

    def test_unauthenticated_create(self):
        data = {}
        self.client.force_authenticate(user=None)

        response = self.client.post('/api/feed/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Feed.objects.count(), 0)

    def test_unauthenticated_read(self):
        data = {}
        feed = Feed.objects.create(**self.feed_data)
        self.client.force_authenticate(user=None)

        response = self.client.get('/api/feed/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get('/api/feed/{}/'.format(feed.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_visibility_public_read(self):
        feed = Feed.objects.create(**self.feed_data)
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/feed/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Feed should show up in the response
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], feed.id)

        response = self.client.get('/api/feed/{}/'.format(feed.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_unlisted_read(self):
        # Create unlisted feed
        feed = Feed.objects.create(**self.feed_data, visibility='1')
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/feed/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Feed should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/feed/{}/'.format(feed.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_private_read(self):
        # Create private feed
        feed = Feed.objects.create(**self.feed_data, visibility='9')
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.get('/api/feed/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Feed should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/feed/{}/'.format(feed.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_partial_update(self):
        feed = Feed.objects.create(**self.feed_data)
        data = {
            'name': 'depito'
        }
        self.client.force_authenticate(user=None)

        response = self.client.patch('/api/feed/{}/'.format(feed.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Feed.objects.get(id=feed.id).name, 'depito')

    def test_non_owner_partial_update(self):
        feed = Feed.objects.create(**self.feed_data)
        data = {
            'name': 'depito'
        }
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.patch('/api/feed/{}/'.format(feed.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Feed.objects.get(id=feed.id).name, 'depito')

    def test_unauthenticated_delete(self):
        feed = Feed.objects.create(**self.feed_data)

        self.client.force_authenticate(user=None)
        response = self.client.delete('/api/feed/{}/'.format(feed.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Feed.objects.count(), 1)


    def test_non_owner_delete(self):
        feed = Feed.objects.create(**self.feed_data)
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/feed/{}/'.format(feed.id))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Feed.objects.count(), 1)


class FeedContentStashPermissionsTests(APITestCase):
    def setUp(self):
        self.user = make_random_user()
        self.stash_data = dict(
            name="Example stash"
        )

    def test_unauthenticated_create(self):
        data = {}
        self.client.force_authenticate(user=None)

        response = self.client.post('/api/stash/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(FeedContentStash.objects.count(), 0)

    def test_unauthenticated_read(self):
        data = {}
        stash = FeedContentStash.objects.create(**self.stash_data)
        self.client.force_authenticate(user=None)

        response = self.client.get('/api/stash/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get('/api/stash/{}/'.format(stash.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_visibility_public_read(self):
        stash = FeedContentStash.objects.create(**self.stash_data)
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/stash/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Stash should show up in the response
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], stash.id)

        response = self.client.get('/api/stash/{}/'.format(stash.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_unlisted_read(self):
        # Create unlisted stash
        stash = FeedContentStash.objects.create(**self.stash_data, visibility='1')
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/stash/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Stash should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/stash/{}/'.format(stash.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_private_read(self):
        # Create private stash
        stash = FeedContentStash.objects.create(**self.stash_data, visibility='9')
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.get('/api/stash/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Stash should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/stash/{}/'.format(stash.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_partial_update(self):
        stash = FeedContentStash.objects.create(**self.stash_data)
        data = {
            'name': 'depito'
        }
        self.client.force_authenticate(user=None)

        response = self.client.patch('/api/stash/{}/'.format(stash.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(FeedContentStash.objects.get(id=stash.id).name, 'depito')

    # def test_non_owner_partial_update(self):
    #     pass

    def test_unauthenticated_delete(self):
        stash = FeedContentStash.objects.create(**self.stash_data)

        self.client.force_authenticate(user=None)
        response = self.client.delete('/api/stash/{}/'.format(stash.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(FeedContentStash.objects.count(), 1)


    # def test_non_owner_delete(self):
    #     pass

    # TODO content stash search tests


class InterestPermissionsTests(APITestCase):
    def test_unauthenticated_create(self):
        pass

    def test_unauthenticated_read(self):
        pass

    def test_partial_update(self):
        # Interests cannot be updated
        pass

    def test_delete(self):
        # Interests cannot be deleted
        pass


class AccountPermissionsTests(APITestCase):
    pass


class ProfilePermissionsTests(APITestCase):
    pass


class DiscussionPermissionsTest(APITestCase):
    def setUp(self):
        make_content_types()
        self.user = make_random_user()
        self.discussion_data = dict(
            content_item=dict(
                title="Example discussion",
                owner=self.user,
                content_type=FeedContentItemType.objects.get(name=FeedContentItemType.TOPIC)
            )
        )
        self.default_discussion_data = dict(
            content_item=FeedContentItem.objects.create(**self.discussion_data['content_item'])
        )

    def test_unauthenticated_create(self):
        data = {}
        self.client.force_authenticate(user=None)

        response = self.client.post('/api/discussion/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Discussion.objects.count(), 0)

    def test_unauthenticated_create_in_group(self):
        pass

    def test_unauthenticated_private_read(self):
        data = {}
        # Only private discussions cannot be read, besides those that are in groups with view restrictions in place
        discussion = Discussion.objects.create(**{
            **self.discussion_data,
            'content_item': FeedContentItem.objects.create(**{**self.discussion_data['content_item'], 'visibility': '9'})
        })
        self.client.force_authenticate(user=None)

        response = self.client.get('/api/discussion/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get('/api/discussion/{}/'.format(discussion.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_read_in_group(self):
        pass

    def test_visibility_public_read(self):
        discussion = Discussion.objects.create(**self.default_discussion_data)
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/discussion/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Discussion should show up in the response
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], discussion.id)

        response = self.client.get('/api/discussion/{}/'.format(discussion.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_public_read_in_group(self):
        pass

    def test_visibility_unlisted_read(self):
        # Create unlisted discussion
        discussion = Discussion.objects.create(**{
            **self.discussion_data,
            'content_item': FeedContentItem.objects.create(**{**self.discussion_data['content_item'], 'visibility': '1'})
        })
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/discussion/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Discussion should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/discussion/{}/'.format(discussion.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_unlisted_read_in_group(self):
        pass

    def test_visibility_private_read(self):
        # Create private discussion
        discussion = Discussion.objects.create(**{
            **self.discussion_data,
            'content_item': FeedContentItem.objects.create(**{**self.discussion_data['content_item'], 'visibility': '9'})
        })
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.get('/api/discussion/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Discussion should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/discussion/{}/'.format(discussion.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_visibility_private_read_in_group(self):
        pass

    def test_unauthenticated_partial_update(self):
        discussion = Discussion.objects.create(**self.default_discussion_data)
        data = {
            'content_item': {
                'title': 'depito'
            }
        }
        self.client.force_authenticate(user=None)

        response = self.client.patch('/api/discussion/{}/'.format(discussion.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Discussion.objects.get(id=discussion.id).content_item.title, 'depito')

    def test_unauthenticated_partial_update_in_group(self):
        pass

    def test_non_owner_partial_update(self):
        discussion = Discussion.objects.create(**self.default_discussion_data)
        data = {
            'content_item': {
                'title': 'depito'
            }
        }
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.patch('/api/discussion/{}/'.format(discussion.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Discussion.objects.get(id=discussion.id).content_item.title, 'depito')

    def test_non_owner_partial_update_in_group(self):
        pass

    def test_unauthenticated_delete(self):
        discussion = Discussion.objects.create(**self.default_discussion_data)

        self.client.force_authenticate(user=None)
        response = self.client.delete('/api/discussion/{}/'.format(discussion.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Discussion.objects.count(), 1)


    def test_unauthenticated_delete_in_group(self):
        pass

    def test_non_owner_delete(self):
        discussion = Discussion.objects.create(**self.default_discussion_data)
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/discussion/{}/'.format(discussion.id))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Discussion.objects.count(), 1)

    def test_non_owner_delete_in_group(self):
        pass


class LinkPermissionsTest(APITestCase):
    def test_unauthenticated_create(self):
        pass

    def test_unauthenticated_create_in_group(self):
        pass

    def test_unauthenticated_read(self):
        pass

    def test_unauthenticated_read_in_group(self):
        pass

    def test_visibility_public_read(self):
        pass

    def test_visibility_public_read_in_group(self):
        pass

    def test_visibility_unlisted_read(self):
        pass

    def test_visibility_unlisted_read_in_group(self):
        pass

    def test_visibility_private_read(self):
        pass

    def test_visibility_private_read_in_group(self):
        pass

    def test_unauthenticated_partial_update(self):
        pass

    def test_unauthenticated_partial_update_in_group(self):
        pass

    def test_non_owner_partial_update(self):
        pass

    def test_non_owner_partial_update_in_group(self):
        pass

    def test_unauthenticated_delete(self):
        pass

    def test_unauthenticated_delete_in_group(self):
        pass

    def test_non_owner_delete(self):
        pass

    def test_non_owner_delete_in_group(self):
        pass


class ImagePermissionsTest(APITestCase):
    def test_unauthenticated_create(self):
        pass

    def test_unauthenticated_create_in_group(self):
        pass

    def test_unauthenticated_read(self):
        pass

    def test_unauthenticated_read_in_group(self):
        pass

    def test_visibility_public_read(self):
        pass

    def test_visibility_public_read_in_group(self):
        pass

    def test_visibility_unlisted_read(self):
        pass

    def test_visibility_unlisted_read_in_group(self):
        pass

    def test_visibility_private_read(self):
        pass

    def test_visibility_private_read_in_group(self):
        pass

    def test_unauthenticated_partial_update(self):
        pass

    def test_unauthenticated_partial_update_in_group(self):
        pass

    def test_non_owner_partial_update(self):
        pass

    def test_non_owner_partial_update_in_group(self):
        pass

    def test_unauthenticated_delete(self):
        pass

    def test_unauthenticated_delete_in_group(self):
        pass

    def test_non_owner_delete(self):
        pass

    def test_non_owner_delete_in_group(self):
        pass


class GroupForumPermissionsTest(APITestCase):
    def test_unauthenticated_create(self):
        pass

    def test_unauthenticated_read(self):
        pass

    def test_visibility_public_read(self):
        pass

    def test_visibility_unlisted_read(self):
        pass

    def test_visibility_private_read(self):
        pass

    def test_unauthenticated_partial_update(self):
        pass

    def test_non_owner_partial_update(self):
        pass

    def test_unauthenticated_delete(self):
        pass

    def test_non_owner_delete(self):
        pass


class PlacePermissionsTest(APITestCase):
    def setUp(self):
        make_content_types()
        self.user = make_random_user()
        self.place_data = dict(
            owner=self.user,
            name="Example place"
        )

    def test_unauthenticated_create(self):
        data = {}
        self.client.force_authenticate(user=None)

        response = self.client.post('/api/place/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Place.objects.count(), 0)

    def test_unauthenticated_read(self):
        data = {}
        place = Place.objects.create(**self.place_data)
        self.client.force_authenticate(user=None)

        response = self.client.get('/api/place/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get('/api/place/{}/'.format(place.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_delete(self):
        place = Place.objects.create(**self.place_data)

        self.client.force_authenticate(user=None)
        response = self.client.delete('/api/place/{}/'.format(place.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Place.objects.count(), 1)

    def test_non_owner_delete(self):
        place = Place.objects.create(**self.place_data)
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/place/{}/'.format(place.id))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Place.objects.count(), 1)
