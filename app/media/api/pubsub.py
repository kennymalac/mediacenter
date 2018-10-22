SUBSCRIPTION_FREQUENCIES = (
    ('I', 'instantly'),
    ('D', 'daily'),
    ('W', 'weekly'),
    # Make monthly an option later
    ('BM', 'bi-monthly'),
    ('M', 'monthly')
)

# NOTE: this is technically tracking users, so strict consideration is necessary when adding actions here
# Some of these actions may or not be trackable for the user's privacy

# The user should be presented a list of actions that they consent to tracking of
# Logs are only kept by the user's consent.
# There should be a checkbox that asks if a user would like to publish the activity publically


INTEREST_ACTIONS = (
    ('Int00', 'create_interest'),
    ('Int02', 'update_interest'),
    ('Int05', 'save_interest')
)

CONTENTTAG_ACTIONS = []
CONTENTTAG_ACTIONS += INTEREST_ACTIONS

# PROFILE_ACTIONS
# FEED_ACTIONS
# FEEDCONTENTSTASH_ACTIONS
# GROUPFORUM_ACTIONS

# Format: action id, action name, action template

def parse_action_message(message, context):
    # Django template parses message
    pass

def to_representations(data):
    l = []
    m = {}
    for p in data:
        l.append((p[0], p[1]))
        m[p[1]] = p[2]

    return (l, m)


IMAGE_DEF = (
    ('Img00', 'create_image', '{{action.author}} uploaded an image{% if album %} to {{album.title}}{% endif %}.'),
    ('Img01', 'read_image', '{{action.author}} uploaded an image{% if album %} to {{album.title}}{% endif %}.'),
    ('Img02', 'update_image', '{{action.author}} updated an image{% if album %} in {{album.title}}{% endif %}.'),
    ('Img03', 'delete_image', '{{action.author}} deleted an image{% if album %} from {{album.title}}{% endif %}.'),
    ('Img04', 'comment_image', '{{action.author}} commented on an image{% if album %} in {{album.title}}{% endif %}.'),
    ('Img05', 'save_image', '{{action.author}} saved an image{% if album %} from {{album.title}}{% endif %}{% if stash %} into {{stash.name}}{% endif %}.')
)

[IMAGE_ACTIONS, IMAGE_MESSAGES] = to_representations(IMAGE_DEF)


VIDEO_ACTIONS = (
    ('Vid00', 'create_video'),
    ('Vid01', 'read_video'),
    ('Vid02', 'update_video'),
    ('Vid03', 'delete_video'),
    ('Vid04', 'comment_video'),
    ('Vid05', 'save_video')
)

LINK_ACTIONS = (
    ('Link00', 'create_link'),
    ('Link01', 'read_link'),
    ('Link02', 'update_link'),
    ('Link03', 'delete_link'),
    ('Link04', 'comment_link'),
    ('Link05', 'save_link')
)

TOPIC_DEF = (
    ('Topic00', 'create_topic', '{{action.author}} created a topic{% if group %} in {{group.title}}{% endif %}.'),
    ('Topic01', 'read_topic', '{{action.author}} viewed a topic{% if group %} in {{group.title}}{% endif %}.'),
    ('Topic02', 'update_topic', '{{action.author}} updated a topic{% if group %} in {{group.title}}{% endif %}.'),
    ('Topic03', 'delete_topic', '{{action.author}} deleted a topic{% if group %} in {{group.title}}{% endif %}.'),
    ('Topic05', 'save_topic', '{{action.author}} saved a topic{% if stash %} into {{stash.title}}{% endif %}.' )
)
[TOPIC_ACTIONS, TOPIC_MESSAGES] = to_representations(TOPIC_DEF)


POLL_DEF = (
    ('Poll00', 'create_poll', '{{action.author}} created a poll{% if group %} in {{group.title}}{% endif %}.'),
    ('Poll01', 'read_poll', '{{action.author}} viewed a poll{% if group %} in {{group.title}}{% endif %}.'),
    ('Poll02', 'update_poll', '{{action.author}} updated a poll{% if group %} in {{group.title}}{% endif %}.'),
    ('Poll03', 'delete_poll', '{{action.author}} deleted a poll{% if group %} in {{group.title}}{% endif %}.'),
    ('Poll05', 'save_poll', '{{action.author}} saved a poll{% if stash %} into {{stash.title}}{% endif %}.' ),
    ('Poll06', 'vote_poll', '{{action.author}} voted in a poll{% if group %} in {{group.title}}{% endif %}.')
)
[POLL_ACTIONS, POLL_MESSAGES] = to_representations(POLL_DEF)


POST_DEF = (
    ('Post00', 'create_post', '{{action.author}} replied to {{parent.content_item.title}}{% if group %} in {{group.title}}{% endif %}.'),
    ('Post02', 'update_post', '{{action.author}} updated a post{% if group %} in {{group.title}}{% endif %}.'),
    ('Post03', 'delete_post', '{{action.author}} deleted a post{% if group %} in {{group.title}}{% endif %}.'),
    ('Post05', 'save_post', '{{action.author}} saved a post{% if stash %} into {{stash.title}}{% endif %}.')
)
[POST_ACTIONS, POST_MESSAGES] = to_representations(POST_DEF)


BLOGPOST_ACTIONS = (
    ('BlogP00', 'create_blogpost'),
    ('BlogP01', 'read_blogpost'),
    ('BlogP02', 'update_blogpost'),
    ('BlogP03', 'delete_blogpost'),
    ('BlogP04', 'comment_blogpost'),
    ('BlogP05', 'save_blogpost')
)


CONTENT_ACTIONS = []
CONTENT_ACTIONS += IMAGE_ACTIONS
CONTENT_ACTIONS += LINK_ACTIONS
CONTENT_ACTIONS += TOPIC_ACTIONS
CONTENT_ACTIONS += POST_ACTIONS
CONTENT_ACTIONS += POLL_ACTIONS
CONTENT_ACTIONS += BLOGPOST_ACTIONS

ALL_ACTIONS = []
ALL_ACTIONS += CONTENT_ACTIONS
ALL_ACTIONS += CONTENTTAG_ACTIONS
#print(ALL_ACTIONS)


CONTENT_NOTIFICATIONS = []


CONTENT_NOTIFY_DEF = (
    ('Reply00', 'reply_topic', '{{log.action.author}} replied to {{topic.content_item.title}}.'),
    ('Reply01', 'reply_comment', '{{log.action.author}} replied to your comment in {{topic.content_item.title}}.'),
    ('Comment00', 'comment_content', '{{log.action.author}} commented on {{topic.content_item.title}}.'),
    ('Comment01', 'comment_profile', '{{log.action.author}} commented on your profile.')
)
[CONTENT_NOTIFICATIONS, CONTENT_NOTIFICATION_MESSAGES] = to_representations(CONTENT_NOTIFY_DEF)

INVITE_NOTIFY_DEF = (
    ('Invite00', 'invite_group', '{{log.action.author}} invited you to a group: {{group.title}}'),
#    ('Invite01', '{{log.action.author}} invited ')
)
[INVITE_NOTIFICATIONS, INVITE_NOTIFICATION_MESSAGES] = to_representations(INVITE_NOTIFY_DEF)


ALL_NOTIFICATIONS = []
ALL_NOTIFICATIONS += CONTENT_NOTIFICATIONS
ALL_NOTIFICATIONS += INVITE_NOTIFICATIONS
