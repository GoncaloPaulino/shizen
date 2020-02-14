import connexion
import mariadb
import six

from shizen.models.plant import Plant  # noqa: E501
from shizen import util


def get_all_plants():  # noqa: E501
    """get_all_plants

    Returns every plant in the database. # noqa: E501


    :rtype: List[Plant]
    """
    connection = mariadb.connect(user="root", host="localhost", database="shizen", password="")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM plants")

    plant_list = []
    for id_plant, common_name, scientific_name, label_name, description, image_url in cursor:
        plant = Plant(id_plant, common_name, scientific_name, label_name, description, image_url)
        plant_list.append(plant)

    cursor.close()
    connection.close()

    return plant_list


def get_plant(idx):  # noqa: E501
    """get_plant

    Returns info about a specific plant. # noqa: E501

    :param idx: The plant ID
    :type idx: int

    :rtype: Plant
    """
    connection = mariadb.connect(user="root", host="localhost", database="shizen", password="")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM plants WHERE id=%s", (idx,))

    plant = None
    for id_plant, common_name, scientific_name, label_name, description, image_url in cursor:
        plant = Plant(id_plant, common_name, scientific_name, label_name, description, image_url)
        break

    cursor.close()
    connection.close()

    return plant


def recognize(body=None):  # noqa: E501
    """recognize

    Recognizes which plant is in a specific image. # noqa: E501

    :param body: 
    :type body: dict | bytes

    :rtype: Plant
   """

    with open('C:\\Users\\trwyg\\Desktop\\file.png', 'wb') as file:
        file.write(body)

    return get_plant(1)
