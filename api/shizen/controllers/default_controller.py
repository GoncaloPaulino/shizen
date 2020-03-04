import os

import connexion
import mariadb
import six
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import time

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

    plant_path = "imgs/" + str(int(round(time.time() * 1000))) + ".png"

    with open(plant_path, 'wb') as file:
        file.write(body)

    IMG_SIZE = 224
    loaded_model = load_model('tf_model/model.h5')
    img_holder = np.zeros((1, IMG_SIZE, IMG_SIZE, 3))

    img = image.load_img(plant_path, target_size=(IMG_SIZE, IMG_SIZE))
    img = np.array(img) / 255.0
    img_holder[0, :] = img

    result = loaded_model.predict(img_holder)
    os.remove(plant_path)
    classes = ["carvalho", "platano", "sobreiro"]

    am = np.argmax(result[0])
    print(result[0])
    print(result[0][am])
    plant_lbl = classes[am]

    connection = mariadb.connect(user="root", host="localhost", database="shizen", password="")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM plants WHERE label_name=%s", (plant_lbl,))

    plant = None
    for id_plant, common_name, scientific_name, label_name, description, image_url in cursor:
        plant = Plant(id_plant, common_name, scientific_name, label_name, description, image_url)
        break

    cursor.close()
    connection.close()

    return plant
