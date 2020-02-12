import connexion
import six
import mariadb

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


def get_plant(id):  # noqa: E501
    """get_plant

    Returns info about a specific plant. # noqa: E501

    :param id: The plant ID
    :type id: int

    :rtype: List[Plant]
    """

    connection = mariadb.connect(user="root", host="localhost", database="shizen", password="")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM plants WHERE id=" + id)

    plant = None
    for id_plant, common_name, scientific_name, label_name, description, image_url in cursor:
        plant = Plant(id_plant, common_name, scientific_name, label_name, description, image_url)

    cursor.close()
    connection.close()

    return plant
