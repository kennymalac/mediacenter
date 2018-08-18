import string
import random

import logging
logger = logging.getLogger(__name__)

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from channels import Channel
from channels.tests import ChannelTestCase

from api.models import Account, Profile, ActivityLog, BlogPost, Interest, Place, PlaceRestriction, Feed, FeedContentItem, FeedContentStashItem, FeedContentItemType, FeedContentStash, Discussion, Link, Image, GroupForum

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
    user = Account.objects.create(
        username='test' + gen_random_string(5),
        password=gen_random_string(10)
    )
    profile = Profile.objects.create(
        display_name="ok",
        description="Depito 2",
        account=user
    )
    user.profile = profile
    user.save()
    return user


def make_random_group(visibility='0'):
    owner = make_random_user()
    feed = Feed.objects.create(owner=owner, name="Example feed", visibility=visibility)
    stash = FeedContentStash.objects.create(name="Default", description="Stored content for this group", visibility=visibility)
    feed.stashes.add(*(stash,))

    group = GroupForum.objects.create(
        owner=owner,
        name="Example group",
        feed=feed
    )
    group.members.add(group.owner)
    return group


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
    def setUp(self):
        self.user = make_random_user()
        self.interest_data = dict(
            name="Example stash"
        )

    def test_unauthenticated_create(self):
        data = {}
        self.client.force_authenticate(user=None)

        response = self.client.post('/api/interest/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Interest.objects.count(), 0)

    def test_unauthenticated_read(self):
        interest = Interest.objects.create(**self.interest_data)
        self.client.force_authenticate(user=None)

        # Unauthenticated users are allowed to view interests
        response = self.client.get('/api/interest/{}/'.format(interest.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get('/api/interest/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_partial_update(self):
        # Interests cannot be updated
        self.client.force_authenticate(user=self.user)
        interest = Interest.objects.create(**self.interest_data)

        response = self.client.patch('/api/interest/{}/'.format(interest.id), dict(name="new name"), format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertNotEqual(Interest.objects.first().name, "new name")

    def test_delete(self):
        # Interests cannot be deleted
        self.client.force_authenticate(user=self.user)
        interest = Interest.objects.create(**self.interest_data)

        response = self.client.delete('/api/interest/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Interest.objects.count(), 1)


class AccountPermissionsTests(APITestCase):
    def test_unauthenticated_read(self):
        # Unauthenticated users should be able to retrieve an account, but not list them
        user = make_random_user()
        self.client.force_authenticate(user=None)

        response = self.client.get('/api/account/{}/'.format(user.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get('/api/account/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # TODO unlisted Accounts?
    # def test_visibility_unlisted_read(self):
    #     pass

    def test_unauthenticated_partial_update(self):
        user = make_random_user()
        data = {
            'email': 'hacker@example.com'
        }
        self.client.force_authenticate(user=None)

        response = self.client.patch('/api/account/{}/'.format(user.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Account.objects.get(id=user.id).email, 'hacker@example.com')

    def test_non_owner_partial_update(self):
        user = make_random_user()
        data = {
            'email': 'hacker@example.com'
        }
        self.client.force_authenticate(user=make_random_user())

        response = self.client.patch('/api/account/{}/'.format(user.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Account.objects.get(id=user.id).email, 'hacker@example.com')

    def test_unauthenticated_delete(self):
        user = make_random_user()

        self.client.force_authenticate(user=None)
        response = self.client.delete('/api/account/{}/'.format(user.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Account.objects.count(), 2)

    def test_non_owner_delete(self):
        user = make_random_user()

        self.client.force_authenticate(user=make_random_user())
        response = self.client.delete('/api/account/{}/'.format(user.id))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Account.objects.count(), 3)


class ProfilePermissionsTests(APITestCase):
    def test_unauthenticated_read(self):
        # Unauthenticated users should be able to retrieve an profile, but not list them
        user = make_random_user()
        self.client.force_authenticate(user=None)

        response = self.client.get('/api/profile/{}/'.format(user.profile.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # TODO unlisted Profiles?
    # def test_visibility_unlisted_read(self):
    #     pass

    def test_unauthenticated_partial_update(self):
        user = make_random_user()
        data = {
            'display_name': 'XD'
        }
        self.client.force_authenticate(user=None)

        response = self.client.patch('/api/profile/{}/'.format(user.profile.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Profile.objects.get(id=user.profile.id).display_name, 'XD')

    def test_non_owner_partial_update(self):
        user = make_random_user()
        data = {
            'display_name': 'XD'
        }
        self.client.force_authenticate(user=make_random_user())

        response = self.client.patch('/api/profile/{}/'.format(user.profile.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(Profile.objects.get(id=user.profile.id).display_name, 'XD')

    def test_unauthenticated_delete(self):
        # Profiles cannot be deleted independently of Profiles
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/profile/{}/'.format(user.profile.id))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Profile.objects.filter(account=user).count(), 1)

    def test_non_owner_delete(self):
        # Profiles cannot be deleted independently of Profiles
        user = make_random_user()

        self.client.force_authenticate(user=make_random_user())
        response = self.client.delete('/api/profile/{}/'.format(user.profile.id))

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Profile.objects.filter(account=user).count(), 1)


class DefaultContentItemPermissionsTest(object):
    def setUp(self):
        make_content_types()
        self.user = make_random_user()
        self.place_data = dict(
            owner=self.user,
            name="Example place"
        )

    def _create_request_data(self):
        _request_data = {}
        for k,v in self.create_data.items():
            if not k in ['owner', 'content_item']:
                _request_data[k] = v

        _item_data = {}
        for k,v in self.create_data['content_item'].items():
            if not k in ['owner', 'content_type']:
                _item_data[k] = v

        return {
            **_request_data,
            'owner': self.user.id,
            'content_item': {
                **_item_data,
                'content_type': self.create_data['content_item']['content_type'].id,
                'owner': self.user.id
            }
        }

    def test_unauthenticated_create(self):
        data = {}
        self.client.force_authenticate(user=None)

        response = self.client.post(self.endpoint, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.model.objects.count(), 0)

    def test_non_member_create_in_group(self):
        self.client.force_authenticate(user=self.user)

        group = make_random_group()
        stash = group.feed.stashes.first()

        create_request_data = self._create_request_data()

        response = self.client.post(self.endpoint, create_request_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.model.objects.count(), 1)
        content_item_id = self.model.objects.first().content_item.id

        # Now attempting to add the content to the group stash should fail,
        # regardless of its visibility
        add_request_data = {
            'content': [content_item_id]
        }
        response = self.client.post('/api/feed/{}/stash/{}/content/add/'.format(group.feed.id, stash.id), add_request_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(stash.content.count(), 0)

    def test_unauthenticated_private_read(self):
        data = {}
        # Only private content items cannot be read, besides those that are in groups with view restrictions in place
        content_obj = self.model.objects.create(**{
            **self.create_data,
            'content_item': FeedContentItem.objects.create(**{**self.create_data['content_item'], 'visibility': '9'})
        })
        self.client.force_authenticate(user=None)

        response = self.client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get('{}{}/'.format(self.endpoint, content_obj.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_private_read_in_group(self):
        group = make_random_group()
        self.client.force_authenticate(user=None)
        stash = group.feed.stashes.first()

        content_obj = self.model.objects.create(**{
            **self.create_data,
            'content_item': FeedContentItem.objects.create(**{**self.create_data['content_item'], 'visibility': '9'})
        })
        FeedContentStashItem.objects.create(item=content_obj.content_item, stash=stash)

        response = self.client.get('/api/feed/{}/stash/{}/content/'.format(group.feed.id, stash.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertEqual(len(response.data['content']['results']), 0)

    def test_non_local_read(self):
        # Local content cannot be read by outsiders
        # NOTE this test does NOT require the GeoSpace microservice to be running in order to pass
        place = Place.objects.create(**self.place_data)
        content_obj = self.model.objects.create(**self.default_data)
        content_obj.content_item.places.add(place)

        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get(self.endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Content object should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('{}{}/'.format(self.endpoint, content_obj.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_local_read_in_group(self):
        # Local content cannot be read by outsiders
        # NOTE this test does NOT require the GeoSpace microservice to be running in order to pass
        group = make_random_group()
        user = make_random_user()
        self.client.force_authenticate(user=user)
        stash = group.feed.stashes.first()

        place = Place.objects.create(**self.place_data)
        content_obj = self.model.objects.create(**self.default_data)
        content_obj.content_item.places.add(place)

        FeedContentStashItem.objects.create(item=content_obj.content_item, stash=stash)

        response = self.client.get('/api/feed/{}/stash/{}/content/'.format(group.feed.id, stash.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['content']['results']), 0)
        self.assertEqual(response.data['content']['results'][0]['item']['id'], content_obj.content_item.id)

    def test_visibility_public_read(self):
        content_obj = self.model.objects.create(**self.default_data)
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # TODO only list Discussions, not other content items
        # Content Item should show up in the response
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], content_obj.id)

        response = self.client.get('{}{}/'.format(self.endpoint, content_obj.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_public_read_in_group(self):
        group = make_random_group()
        user = make_random_user()
        self.client.force_authenticate(user=user)
        stash = group.feed.stashes.first()

        content_obj = self.model.objects.create(**{
            **self.create_data,
            'content_item': FeedContentItem.objects.create(**{**self.create_data['content_item'], 'visibility': '0'})
        })
        FeedContentStashItem.objects.create(item=content_obj.content_item, stash=stash)

        response = self.client.get('/api/feed/{}/stash/{}/content/'.format(group.feed.id, stash.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print('content', response.data['content']['results'])
        self.assertEqual(len(response.data['content']['results']), 1)
        self.assertEqual(response.data['content']['results'][0]['item']['id'], content_obj.content_item.id)

    def test_visibility_unlisted_read(self):
        # Create unlisted content_item
        content_obj = self.model.objects.create(**{
            **self.create_data,
            'content_item': FeedContentItem.objects.create(**{**self.create_data['content_item'], 'visibility': '1'})
        })
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get(self.endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Content Item should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('{}{}/'.format(self.endpoint, content_obj.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_unlisted_read_in_group(self):
        group = make_random_group()
        user = make_random_user()
        self.client.force_authenticate(user=user)
        stash = group.feed.stashes.first()

        content_obj = self.model.objects.create(**{
            **self.create_data,
            'content_item': FeedContentItem.objects.create(**{**self.create_data['content_item'], 'visibility': '1'})
        })
        FeedContentStashItem.objects.create(item=content_obj.content_item, stash=stash)

        response = self.client.get('/api/feed/{}/stash/{}/content/'.format(group.feed.id, stash.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Unlisted content items are shown in a group but not visible outside of its stash
        self.assertEqual(len(response.data['content']['results']), 1)
        self.assertEqual(response.data['content']['results'][0]['item']['id'], content_obj.content_item.id)

    def test_visibility_private_read(self):
        # Create private content_item
        content_obj = self.model.objects.create(**{
            **self.create_data,
            'content_item': FeedContentItem.objects.create(**{**self.create_data['content_item'], 'visibility': '9'})
        })
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.get(self.endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Content object should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('{}{}/'.format(self.endpoint, content_obj.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_visibility_private_read_in_group(self):
        group = make_random_group()
        user = make_random_user()
        self.client.force_authenticate(user=user)
        stash = group.feed.stashes.first()

        content_obj = self.model.objects.create(**{
            **self.create_data,
            'content_item': FeedContentItem.objects.create(**{**self.create_data['content_item'], 'visibility': '9'})
        })
        FeedContentStashItem.objects.create(item=content_obj.content_item, stash=stash)

        response = self.client.get('/api/feed/{}/stash/{}/content/'.format(group.feed.id, stash.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['content']['results']), 0)

    def test_unauthenticated_partial_update(self):
        content_obj = self.model.objects.create(**self.default_data)
        data = {
            'content_item': {
                'title': 'depito'
            }
        }
        self.client.force_authenticate(user=None)

        response = self.client.patch('{}{}/'.format(self.endpoint, content_obj.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(self.model.objects.get(id=content_obj.id).content_item.title, 'depito')

    def test_non_owner_partial_update(self):
        content_obj = self.model.objects.create(**self.default_data)
        data = {
            'content_item': {
                'title': 'depito'
            }
        }
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.patch('{}{}/'.format(self.endpoint, content_obj.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(self.model.objects.get(id=content_obj.id).content_item.title, 'depito')

    def test_unauthenticated_delete(self):
        content_obj = self.model.objects.create(**self.default_data)

        self.client.force_authenticate(user=None)
        response = self.client.delete('{}{}/'.format(self.endpoint, content_obj.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.model.objects.count(), 1)

    def test_non_owner_delete(self):
        content_obj = self.model.objects.create(**self.default_data)
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.delete('{}{}/'.format(self.endpoint, content_obj.id))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.model.objects.count(), 1)


class DiscussionPermissionsTest(DefaultContentItemPermissionsTest, APITestCase):
    model = Discussion

    def setUp(self):
        super(DiscussionPermissionsTest, self).setUp()
        self.endpoint = '/api/discussion/'
        self.create_data = dict(
            content_item=dict(
                title="Example discussion",
                owner=self.user,
                content_type=FeedContentItemType.objects.get(name=FeedContentItemType.TOPIC)
            )
        )
        self.default_data = dict(
            content_item=FeedContentItem.objects.create(**self.create_data['content_item'])
        )


class LinkPermissionsTest(DefaultContentItemPermissionsTest, APITestCase):
    model = Link

    def setUp(self):
        super(LinkPermissionsTest, self).setUp()
        self.endpoint = '/api/link/'
        self.create_data = dict(
            link="http://example.com",
            content_item=dict(
                title="Example link",
                owner=self.user,
                content_type=FeedContentItemType.objects.get(name=FeedContentItemType.LINK)
            )
        )
        self.default_data = dict(
            content_item=FeedContentItem.objects.create(**self.create_data['content_item'])
        )


class ImagePermissionsTest(DefaultContentItemPermissionsTest, APITestCase):
    model = Image

    def setUp(self):
        super(ImagePermissionsTest, self).setUp()
        self.endpoint = '/api/image/'
        self.create_data = dict(
            src="http://example.com/test.jpg",
            content_item=dict(
                title="Example image",
                owner=self.user,
                content_type=FeedContentItemType.objects.get(name=FeedContentItemType.IMAGE)
            )
        )
        self.default_data = dict(
            content_item=FeedContentItem.objects.create(**self.create_data['content_item'])
        )


class GroupForumPermissionsTest(APITestCase):
    def setUp(self):
        self.user = make_random_user()
        self.create_data = dict(
            owner=self.user,
            name="Example group",
            feed=dict(owner=self.user, name="Example feed")
        )
        self.group_data = dict(
            **self.create_data
        )
        self.group_data['feed'] = Feed.objects.create(**self.create_data['feed'])

    def test_group_search(self):
        # TODO
        pass

    def test_unauthenticated_create(self):
        data = {}
        self.client.force_authenticate(user=None)

        response = self.client.post('/api/group/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(GroupForum.objects.count(), 0)

    def test_unauthenticated_read(self):
        data = {}
        group = GroupForum.objects.create(**self.group_data)
        self.client.force_authenticate(user=None)

        response = self.client.get('/api/group/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.get('/api/group/{}/'.format(group.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_local_read(self):
        data = {}
        place = Place.objects.create(**dict(
            owner=self.user,
            name="Example place"
        ))
        group = GroupForum.objects.create(**self.group_data)
        group.feed.places.add(place)

        self.client.force_authenticate(user=make_random_user())

        response = self.client.get('/api/group/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # GroupForum should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/group/{}/'.format(group.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_visibility_public_read(self):
        group = GroupForum.objects.create(**self.group_data)
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/group/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # GroupForum should show up in the response
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], group.id)

        response = self.client.get('/api/group/{}/'.format(group.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_unlisted_read(self):
        # Create unlisted group
        group = GroupForum.objects.create(**{
            **self.create_data,
            'feed': Feed.objects.create(**{**self.create_data['feed'], 'visibility': '1'})
        })
        user = make_random_user()
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/group/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # GroupForum should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/group/{}/'.format(group.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_visibility_private_read(self):
        # Create private group
        group = GroupForum.objects.create(**{
            **self.create_data,
            'feed': Feed.objects.create(**{**self.create_data['feed'], 'visibility': '9'})
        })
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.get('/api/group/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # GroupForum should NOT show up in the response
        self.assertEqual(len(response.data['results']), 0)

        response = self.client.get('/api/group/{}/'.format(group.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_partial_update(self):
        group = GroupForum.objects.create(**self.group_data)
        data = {
            'name': 'depito'
        }
        self.client.force_authenticate(user=None)

        response = self.client.patch('/api/group/{}/'.format(group.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(GroupForum.objects.get(id=group.id).name, 'depito')

    def test_non_owner_partial_update(self):
        group = GroupForum.objects.create(**self.group_data)
        data = {
            'name': 'depito'
        }
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.patch('/api/group/{}/'.format(group.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(GroupForum.objects.get(id=group.id).name, 'depito')

    def test_unauthenticated_delete(self):
        group = GroupForum.objects.create(**self.group_data)

        self.client.force_authenticate(user=None)
        response = self.client.delete('/api/group/{}/'.format(group.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(GroupForum.objects.count(), 1)

    def test_non_owner_delete(self):
        group = GroupForum.objects.create(**self.group_data)
        user = make_random_user()

        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/group/{}/'.format(group.id))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(GroupForum.objects.count(), 1)


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

    def test_non_owner_read(self):
        # Non owners cannot read someone else's Places
        data = {}
        place = Place.objects.create(**self.place_data)
        self.client.force_authenticate(user=make_random_user())

        response = self.client.get('/api/place/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        response = self.client.get('/api/place/{}/'.format(place.id))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

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

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Place.objects.count(), 1)
