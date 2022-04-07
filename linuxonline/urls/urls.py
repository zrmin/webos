from django.urls import path, include
from linuxonline.views.index import index

urlpatterns = [
        path("", index, name="index"),
        path("menu/", include("linuxonline.urls.menu.urls")),
        path("linux/", include("linuxonline.urls.linux.urls")),
        path("ide/", include("linuxonline.urls.ide.urls")),
        path("chat/", include("linuxonline.urls.chat.urls")),
]
