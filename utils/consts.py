# coding=utf-8

# #
# general request response status code
#
SUCCESSFUL = 0
FAILED = 1000 # reason unknown; catch-all case
FORM_INVALID = 1001
FORBIDDEN = 1403 # 403

# #
# user status code
#
ACTIVE = 2000
INACTIVE = 2001
EXPIRED = 2002
UNACTIVATED = 2003
AUTH_FAILED = 2999

Type_to_Ext = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
}
