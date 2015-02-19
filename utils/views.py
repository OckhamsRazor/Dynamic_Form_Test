# coding=utf-8
import os
import traceback

from django.contrib.auth.decorators import login_required

from .utils import general_exception_handling

def default_img_path(instance, filename):
    pass

@login_required
def handle_file_upload(request, file, destination):
    """
    Should do some nginx-gridfs operations and security check here
    """

    # WARNING #
    # FIX THIS SECTION BEFORE DEPLOYMENT #

    try:
        if not os.path.exists(os.path.dirname(destination)):
            os.makedirs(os.path.dirname(destination))

        with open(destination, 'w+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)
    except Exception as e:
        general_exception_handling(e)

    # END_WARNING #
