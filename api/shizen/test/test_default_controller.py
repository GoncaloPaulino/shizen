# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from shizen.models.plant import Plant  # noqa: E501
from shizen.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_get_all_plants(self):
        """Test case for get_all_plants

        
        """
        response = self.client.open(
            '/plants',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_plant(self):
        """Test case for get_plant

        
        """
        response = self.client.open(
            '/plant/{idx}'.format(idx=2),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_recognize(self):
        """Test case for recognize

        
        """
        body = Object()
        response = self.client.open(
            '/recognize',
            method='POST',
            data=json.dumps(body),
            content_type='image/png')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
