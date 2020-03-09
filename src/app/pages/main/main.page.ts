import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, take, map, switchMap } from 'rxjs/operators';
import { API } from 'src/const';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {}

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      
      this.showAlert("Sucesso", "Imagem carregada com sucesso!");
      console.log(imageData);
      let bin = this.convertDataURIToBinary(imageData);
      this.classifyImage(bin).subscribe((res) => this.showAlert("OK4", String(res)));
    }, (err) => {
      this.showAlert("Erro", "Ocorreu um erro, por favor tente novamente.");
      let b64img = "/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTQK/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgA3ADhAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+WjAnXaox7UgjjI+6p98Unm5HekLZ4xX3N/I+OsP8qP+4v5Uhij/ALiflSb8UjS4XtxRcLAYlJ4RPyFIY0HVE/Km+cSfb2oaQHrmi4corIuOEX8qaUUDiNB68DmmNNs796Y13zjp+lFx8pJIqBSfLBP+6Kj+Q9Y4x9QKjlutwwTx7d6iaQluOlFxWJ2RD/AOPYVNYHTx5xvGaJVjJQrHu+btnA6VREuPvHNRzSlUJUBm7DOM1cJJO9rg4so3viCwX7vzHvtiJ/pWRqXiiAZCWsjkDj5Ao/Wna+08ys7afENoz5guApH16VxuoeIxY+Y9zI6jokWBlvfPpXXhqVCor1L/AKGVSdSLtFFnWvHTo5VIoIz/ALK+Y2PfoBXJan8RBLIRJNdHn+AKmPyqp4o8VTapEUQeVFjoDkt9a5eeN5gcKW78DpWFd04P91G680dNKM2vf0NHUvFSXM5zE0o7GWQmsybxPBHJn7KqY7qcVSv2Zpm38N0IxjFZ90+GIByCK8+eKntZfcjphSX9Nm0njFnO1TOo6Y3bh+RrPl1COaVl3IuTlCBtKmsmVivU/lUM8m1QTznpXM61tWjZU+zOos9eKLtmUNj+IAZ/Ed60oZ0niDqQwPQiuAa9dMfMRjp7Vf0bxG9k3XI7j+9/9eue8HqlY1s+51zspzwBmqk7IvO0flTortLqMMjZU9KgnkyTSaQK5WuXBJ4AH0qhcEEnFW534zWfPIB3rKSRauRTAY5A/KqN0FLcAVZnmwDzVG4kz+VZuxokN/AflRUWW9T+dFTdF2Z+gPnc9TR5/uag8wMO5oEg7Gvo3LseFypE5nBHPam+fkjgj8agMu0896GlBPGcVHONJMnMpI4ppcnnNQeaRSGU/wB6jnKUUiV5gp45NQvLuOSaaZB2OKYXA96ftGLlHmRQarXepwwSBHfYx6Z70rSDrnNMnCXCbWCsPQ1cZX3JaLM09qmkC4F5G02/b5CqS+PXis6bWJCuI4XB/vSfKB/WoLlpIpPKt5Gd+yN8wUepPUCoo74Tu0ZZZJYxiQoPlU+lfRYLL8PWSkr/AOZ5mJxNWm7aMo+I5p3tXkJ86QD5VJwgP0rgZfDN3q+pubksu4b3buPQfWvRNUlSC3LvjavJzXMeNNbTSNLdwQszjCjPIzXdisJQjG70Uehy0cTVcrLqYWu2mneH9LYSRKc9Bn5nIrlbPVf7Q1PChY0QExxqMAH1Prjk1U13WZdUnLyMTgYA9BWfZ6j9hMxCks8ZRT/dz3/Kvmq+OjOouVJRR7VPDyjF3d2Z+pSb7l23biSTnHXnrWfcn5s1p36IlnA3WSTcT7DOBUFrpT3F0FbA+UP9R/k15UoOcml1O6M0o6mRfSBn4UKD2Hak060F9cmNiRwcEdjV7xPpX9m3ZVSSjcr9Kzra4azuFkXqvWsnDknyzNE243gR3emywSsoUsR1wKk060R4mDLlgfxFblxOoUPnAbGDWfNGFmLLwT1966PqsU7ozVeVrMfp17/Z0uNzGNjgg9vetSaXcCc5rAkYFuuavWF39otMZ+dPlPvXFiFZ3N6Urkl1KNmOBVKV+KGuBcSOo5CHGfU1FO20da5ZO+xsV5zVKVsZx3qzcTfLVKVuc84rFmgbqKhyPUUUrorU++TKR3oM3HXiq3mYFKXyte2m1seOkix5tNNzg4qIOuPrSM45x0o5mPlXYlMxYfSonlCkgGmGQN3xUbyZ6dvakPkb2Ji+e9MaUEdelRFyfWmDgnnNAnTZJLOHBCjiq91OY0AH3m4XJwM0rS7c56Cs69V7zURklYYlxjP3yf6f41pCaUlfYhruPupzJFsgJIlbbv6PO3t6L/SpLGOOwQ26kGRRvfHqe/8An0qIXKWwur18eXZxkKP9o9f6D8a871LxndBrkpKyPcsGdgefoPQV9Nh8bGhCNWtvLZdkeVUwzqycIbL8WX/Gfjcx6q8afvEhk4X+Elen6n9K4nVdSk1a7aWaX5nBJY/yp+oTmTknJPc1z7agJ76VASVQevGa8PF5jKrJ3ejPTw+DjFe6thLiTCsSeO1U7iQJ3qecvcIxVGKr6Dj61Rum4rzpSb1O32bsQTzZwMk4ra0PUY7y6gUBlkhhKMT35rlby9EWo+WSQpGPxp6XLWzhlYqV708PifZyuKpQbib3jlAbGJyMMGxXJTMQcjkVueK9WGoWtsVOSy7m9jwP8a56RyrHnirx1RSquUfIMLBqFmbV3J/xIUPcKpqOO48+3VzySOaiS+S60SRBwYkA+tQaVODaMCcbT3Na+0XMrdUZuOmvcht7j53Q5LK1SR3xtRKAcF1+X6/5NUEn26qfQsR1p6yiZGfvHnFcc2pRszdKzuaNmPKtl9wW+uajnkKtnrSXF6LeNUHzOBjHpVCWeW6kI3bR7dq4mup0JXJJ5MMfcVVmbAGKlb5EwSSR3JqtM36VhI1iNyPUUUzf7/rRUlH3WJiTjIFSxyle4rBt9aaWQAnFa1tPuQZr01XucXsWty1knvQ2SuM0KQw4pcZNNVQ5UhjDApMZx7U/GB1wKjYY5Jp+0YuRiM4YcGo5WOMKMGhxgYGcZ61GzbepzTjK5nyMa+4DnrVS5n8tWzzjoMcsewqSecIMs2AeKsRWMelWn9o342BBmKM9R7/X27V34LDSrTt0W7OTE1PZq73Oe+IN3/Y3heCzyBPcHzJP8/X+VeY3M+HkyM8Cuu8bSXet3RvZkMccrhIlbjI9h/WuL1qL7JcyRMeUJBI74NXmdVyqe78MdF6IrBUrQ13epna/qBtLCVgeQdoNL8I41udTut6qw8rJBGedwrI8Q34lsJo+pWUk/TNa3wY+bU7sHj90D/49Xj06vNiIroepycsHc7a9t1aJ0CqA4IwB7V5PrqGzMq9DGxU59jXrN2+c9K80+Jlt9lvbgjhZE3j+td+Lb5bmNPVnD+IJiNQOOBwf0qQ3xl0jcThhwaz9TufPmVu+0CktdTaytzt2lg2cEZ4Oa8NVVztna6eiNOSXegIziq075Y8URz7rRXPULzTGmDxBh3FdPM7XMbWegwXDxqwBwCMH6U0XzpC654fAPtTWdSxBIyBnFMlXy1XOCG54pSqPoFk3YZ5ximV1bdg5qzYyGSOUA9SP51QmfYwIxnOMVPpuQJAAckAD65p0ptysVOKtoXJJQXKrljnBPqamEXkx4H1PvRZxKnzHnbwv9TTbhzuOO5qas+xnBWI5nqpNJ1qeds9sZqrMcZ+nWueRtHYi80e350UzA9RRUlH2Npjl5gSc101s3AGOK5bST+8HNdNYOSgBzU4etdas1nQNGP2607n2FESnAPrUnksO61t7exH1fyIm3c9MVG5G2rJhIGeDioHUPkdzTVa/UPYEMhxVS9dvJOxgGPfGatSHYelVLjIzjmtoT8zB032E0vUP7Kfe1vFcTf33Y8fQdBTr7WJdfvUEyxQxQKZnZRllUehPTJwOlU5pMr0qjfXJNndW6E77gpGT/dQZLf0r1sLmNSKUG/d1PPxGEhJ89tTCvUuvFmpG6ldliDhYx684AHtXFePJkttTuegBnYD1PNenQFILmBQoWKBjK3oFQFv6V5WNLHxB8b/Y2uxaRMXdpim/ZgEngdelc2IqOVLmerkzooQ/eWWyRxGozbZrgE53Of511nwvu7KDXJvJcrG1sAS56tkVyWqWBF7d5ljBi3H5jjdg4wPetL4Y6qNL17LDIeNlHPf/ACK8nDVXGtH1PSnG8T0HUdftoGILSNj+7Gx/pXDfETUrfVIFMJYuFZSGUrwee9dwkGq63OiWunXsrykKiRx7Sxz6tz+lcr4ys7+80RnOnziMLvDmUNgepFevWqc14dTnhC0VJo8hvR5Z+lVnyGz61ua/pItdPs5gP9ehz35DEf4VkSzpBbBUYkuP3mR054xXhSg02mdFtCb7WU0fk8k7amt5BLaxk+lZM92fsqp6MT+gq3pVxusypOdpraE22kZSiVL25aLUG574FXvNDBSMnjmsfUJt91IRjGeKtwSO9mhXBKjLc9qUJe80NoluMvIuPXNXNPHlBm6A8Aj1qCO2aRGkBGF6DuaLYSXTLGhIUc/n1raDs7kyV0aT3BKAJgAcAdTUblgME5apI08pMDt39ahlb5qJu7M0rMbM/T1qrMxbr3qWRuPpVaV8t9axbNIjePeimbx70Uhn2LovEoHvXYadbF8VyugRFphxXcaRZbkU4614lPE2PoPqiZLDakDmpxZkgcZrUsdGMoztzWgugso+6cUSxnLudEMub6HMyW2wdMVXe32ZrqLrRvVay7vTTHnAp08bdk1Mva6HP3AIByMVRnzySK19Ri2DkcVlXaYU8mvRpVzy62H5SlOwzyRms2ZVjupJOruoH0ArQnCqOorI1GZ2DLEp3Y+8eFFd0ZnmyptGF4y8SiysLmOM77mVfIQLyRuwWP5YH4muQ8DwDTPFywXo2t5biQDqNy9P1rtotGh06T7RLiSZcnew6d+K4K7iubvV7vVI+qM0iqRneoO38sUq1aScW+hpSgtUYvxZ0hrHxXeYVQpcP8hyoz/k1jeE9QfSNftZo2KMr/ezjGeK7pGtvGmnX5w6SvCpwRu2SBmbr1wc9fesTwX8N7nxRpGq3ttnztIEUhT1DMQf1xURpSlVUqfXU0m0lZnoemeMJb2Ircwhkxgupxn8P/1VjeKNSl1C0kgQLDAUK4X7zDHT2qwl39ptI3KlW24YEYIPcfnVC85U/Wvd55Ne8cLgrnnvjTS/s/hCx4AaJuePUZrjvEWkNpF0qHo8av8AmP8AHNeo+LNP+3WCRjHEi8e2a5jx9pH9p+WyLgxFUJ9mOP0rzcTQ0bXkbwnbRnnki4WrGjTeXNIp6EVb1TRHstP8xhh4pTG/H0IrHiuDbzhgc+teem4tJmso8y0Awm5udqlQWOcscCmRuwl2bjwccfWgXKeQ6lQXJG1j2qTSIPtOoRrgtlhwO4oWrHJaHT2UC2tieXyy5Zexz0/z7VBY3EFtCqhss2Ce+an1J3WUKAN7gAKDnYOeSfxqOCzFumerYxmuyeuhztkkzgniqssh7ipZDtzk1WkfA7mszNIazcd6rytinyyHAxkVBN05rM1E3iio8/WigD7e8Mwh5FwM16P4c0sSFeM/WuA8JoGlUd69f8D6YbgoD29q+BqYzkTbP0rB4Hnkjc0Lw0ZlGAAa6O38ByXCDCE59q634d+B/txj+XIPtX0N8OPgOl9pzTSW4fIwMivzvPuM6eDfvSPvMvyKk43mfIGreCWgjOVII9q4/XNDaEtlcYr66+Lnwc/sSeUCIKO3FeAeO/Dn2V2GMYPpXq8P8TxxkVKL3OPNskjCN4o8W1ez2kjGcVzt9EQTniu48SWfks3+cVxerjaWr9JwWI5kj83zDDcjMW8bkg8VmXciheau3z4PNZV/KCo9c179Gdz5qtT1KGrq15A0WWCvwxHpWVbwIY5SFXy3HlqP9kf5JrRurg81nzTBVPNdUUrnE20tDitMin8L+NdsbFNxIXI4cEcA161+zVJaH4m6lYXSRwW/iKxkhCE5G8EN+fBrzzxHp5vmjniOJ4DuX/aA7VV1HW59ONnf20jQXFtMroy8FT/+ut8FN4eopvVJ/gTXvUjyp7o7fx74Yl8I+ILqzlXDxPjOMBx2P5VyGoXQjB+ViPYZxXpfibx3Y/GXwzHNlIfEunRfv4On2qMfxJ64646jmvMbyUc45r18SoX5qb0exjScre/uZl3eIzdT/wB8ms++KPES2Sp9B1rQuXDZ4rNuGxJnccelczaN1YxPENtHf2c42SEunPy8Ejocn0rzS64c8YFer37bopM/3TXm2s6abbT4JiOZi35DFeZjIO/MjSk3dmWqeZgKMsTgD1rU8MbrbUWfZuaMHg9jWbDGZZFUcE1raIDF5jdctiuSCfMXUloa6MSxZsF25PFNmfj6VGkpz9aWRtvXpXWnocpFK/rUDtgY9akkOfxqBnx+FQOKEkIxUMzfLT2IxzUUnA9qzLI8Cim5HqKKAPuvwZJ5kyEdq9y+GsavJHu9hXgPgm823Kc17d8O9WEcsZJA6V+UY1SdN2P2TKuXmVz62+A+iJfXECkcZFff3wZ+CiXng6CQooDgnJ71+dfwL8bR6fdW7EjAINfof8C/2kNJm8D2ljcOqSwEOCD171/M/HeHxDr31t5H2eYRxP1bnwau/wBDx79rf4eJoU8i7ArAc18MfFu0W3u5cAf419r/ALZ3xxsvFurXD2zDy/ujHtXwj8V/Ea3FxKc5zX1nh1TrwglPY1xMZxwUXW0k0rrzPIPGAGW5rz/WpAAfeux8W6iGZ+cnniuD1y65r+jstuoq5+UZvbmMXUJvmb6Vj3shyelaF/OHJ7E1kXkhGcHNfVUHofHYj4ipMd6nmqF4OM1Ylfjiqt02CAPSu+meXLqVrlticYrJ1iMXUKx4Gd4b9RWncHg+tRWGiT67fJBbRySyyHACKT/KuinTlNpRV2zBzUXdnDeKbm6tdV8+1Z0e3VTvUkFTnrml034hyX9wVvBuc/xquCfqBXtGo+CNK+F3hTULm/Ntqt5fK1tEm07M9DjPPHr7V4X4esBb+JJ/lGIgcVtisHVw04rm1luuxph60akW7bHQNdLKMqwKn0qjcy4LcVNfIOSpKtnsOtZ9w8rcAoPcDmtG3syyrq97Hb2shlkCBgRyea4rxHqa6w0UEKbUh+Vc9TnFdDrcVrPOY5BI0nA3Z55//XXPWVn5WqBWHC5YfyrhruTfKtmXGyVzOtrV4JW3DaVGCCKv2a7FPuc11dz4KbxHY291avCkrR+U6Odu5lwAM9MlcflXPXOnTaVO0M8bRSLwVYYNKphpwd3sZKoprQaDz70SPuFIF5PHWmuaXQl3GydOtVyc1LL97ioGJUVI0hH9zUUjAA+9OZs9ahlO7g1mWLvFFRbR60UFcp9m+F7zyZ1OfSvV/B+veUEIIGDXiul65FE44xj3rqtF8YLGww/t1r4PEYWNrXP0PBYxxaZ9O+CPiEbRUO7GPfpXq/hj9oC60dY5I5yDEwcDPXBzXyD4a8ctMVRWOTwK+tPgl+x7r+saDbeIvGUknhjwyVWZ2dN15LET95IuoGO7fgDXxOY8P0q8tY3fofc4LP5Uqd29DJ8bfGGXVI3Z5WJbJwTXkHjTxb9rZizdTXp/7cPi/wCHFhrWmWHw9trmOKxtxDdzyTO5u36iQ7+56cYHB46V8w694qeVGJLYz6V2ZRlEMOkuXlfY5cyzqVaN77k/iPVw0jEHOa5HVr8OSM1X1fxQMkEmsC98RruPNfeYNRikj4DH1HJu7LlxMHzzWfcSbhxniqqar9sk2pksTgYrvfDP7PHizXp4TLpN1Z28hyXuAIjt9cHnpX1GBw862lKNz5jFTUNZM4N7dpQNoz9Kt6V4F1TxFOqWljczs3A2Rkj8T0FfUGk/C/wh8LbBJZra0lmQAtcXzhufZT8o/AVheNf2lPDuhxNHBKbxkHyx26YQfjwPyr7CnkNKlHmxdRR8kfPTxs5O1KNzyK8+AD+FdGl1TxBeQWkEKg+VG253YnABPQc+ma5nxN8ZodOtotM8P2y6ZYkiOa5RP39x/eIJ5A64yc034wfGvUfiDMbeWQRaez+YIFAwNvTJ6k15t9sF7OzfwRZA+tcuJx1KnLkwei7vdm1LDylHmras1/G/jKbxPfBm/dwQr5cMeeI0Hb6+prmLFVj1KVuhkUfpUt1NuJxgrVCec28wcclTnGetebOq5y55vU6oRSVol+7fKnPWs+4l2HHNWJLlZF3qchhxVC4l3Mearm6lJGHrAP8AaMm1eoByPw5/SqwizduxAGMgfic1r6jcC3jyMF24ArIdyqHqCf1rlluVc2dGu/tWk3tj1kdRLF/vL2/EZqO38RWuraYbPVFbdEp8icDLJ7Z7isq2untJ1lQ4ZCCKg1J1+2OUACP8wA/hB7V0+3fIvu+Rh7JXZp3ngi/ghM0cLXFvjcJIvmBHrjrWBKCrEHg+/Fb3hHxxc+HpNgYvADyhPT6V0NxoekeN4mntz9muG5bb2Puv+FUsPTqx/dOz7MzdSVN2lsedlzUTyZ79K0/E/hq58O3OyVQynlXXlWFYMs209K8+rFwdpaHTFprQmaRQKheYA9RULXIJ5xUckw9qx5kWkTecPU0VX80UUudFH0lY6qQBk1s6brJDjniuKt9Q5rRs9SwBz+FfJ1KV2fVUa9nZH0D+ytGfFHxr8L2ABYT6lAGHUbQ4LfoDX11+1T+09f8AxA8VXNrDeP8A2dZyfZ7dVb5WIO0uR3zz+FfCX7Onjmbwx49huLebyZ/KkjRx1UshU49DgnmvVNY8RyCWF2If5+fm74ODXZhsMvYtLqzZYn3rtnr3wp1n4e6bNqd94s8Pz+KruXZHbW5vHt4YRjLSMUOWY5AA6DBrbv8A4j/D/wAU6fNoOlfDfwbpivGx+0X93M0gB44lJ3BvQ57V8/2OtkWjSsdplJcjPQdv0qmmtEq87MR5p3DPYDj/AOv+NOnlVBS5nH8/8zoqZpV5eWMrHCfGHwZc/D3xE9rPLZzLKPNie2uFmjZcn+Id/Y81wVzdFmNep+JrK21+xkmvQd+0mNskGMdv8a8ns4W1DVY4ExulcKMnAOTitpYLlkuVbnkVq11e56f+yr8L5viZ8TrZFGLawzdzuRkKF6fiWwBX0j8c/ijP8O9I+3iUNcOHt0R8EFyvDY9iB+dO/ZK+Ev8AwqXwXey3DxS319OVaROgRPlwD6bt314ry39uTWRceIbS2iUAQQF2x/eYnnH0Ar9OwWFll2Vupb35fgfGYiusRi1FfCjxnxT40vteuZJrq5mmdznLuTXMXt6X+8Sfxo1K+3xKwOMkZH41m3VzuHFfMSqyk7ydz0+RJaFbU5VuLlAxOFUnHr/nFUVmxEzcDeSTUep3TCV1UZYqB9OvNUL+5kWA4OzavAHJrNy1Isya9uVizyAT0HrWZeXLZzgBfc81VkuAXDknPXnrTrpzKgKnpzg9DVRlcnlsOsZgJCuXQtkrk8Z9Kku5xFCzHA4z7VnTTlF5JUjkH3qO4vzeIoACgdfc1XM0rMCGW7e5cufwycACq01wc/MMD68Usx3E7T83eombb1IxUNgKZg3cYqtdAO4IJweDg96ZMwHzdCfSoJLnaCDwPcVDkBNG+0spPfOasWupy2cgaN2Rh3BwaoxyZJyaeX78U41GtgsnuddpfjpL2H7NqMayxtxvI/mKXX/ANlrFiJLHbFKF+XacrJ/9euQEnvWpoHimTR5tjEmF+COuPcV2U8Upr2dZXRzTotawdjkLuFopypBDKcEVESc1s+MbH7LfiQci4RZc+5HNYo6jNePVi4ScTsi7i0UUVjc0seyJcgMRmrUGoMorCW6O7NTwX4xznNeS6Z60Z8vU7fwV4mGja5a3JJKRSqzAemef0r3S91OLVo41EuFYhyB1Ir5bj1byycEDNb/hz4iXulXkMonlkWHgI7kqR3H0rqw9VQ91rRjdRn0RNqYMZX+EjpVK/vWltmUHBIxXC6B8UX1+4YLbqqrjIVssRznH5VsHxHFNGrgS4PQ7DXrLkkrx2MnVLnim4a60eWFDgMArYOCBkZrk7LwBep4j02KIebHqcgW2kX+L5tuD6EHHH0PetXUdYE0eEB+YjlhjnPTmvUfgilulnp1wtsl3c6PdrIsfCli+Y2PPf5oz/wABrvwWBjiKyT8jgxWLcIXPpTTkTQtDtLGM/u7WJYh74A5r5h/aqvln+I9yOoEMY/8AHR/jXbfH3xtrEWmR3WlXtxawQHy7iNMpJC56FvY/lXz/AOLfGd74suzc38pluSoRmIGSAK+wzrFwdL6sltY+fwNGXM6rOI1a4EUrpnAEmB+dZ0053E9u3vVnxMBHeIVPEhDY+lZFzOQ2AxA9q+KcGnY9rmutCC6nzcsTzu/xNZ97dK+4FhnBHWpb0l5V2kDIOe9U5kVc5O76ipS1BvuVNQPkuCuCJFB+hqCO/Ma7WHHrViVPtVogzyAMH0NZ19AVJUncPUUbbEN3JryZfKJ6g1RmdsYB2jI4FIZXjQoQSuRz3qORdpB/2sdc55ou+oDnkwSOwqAybmOeF/nUkx25zjB/WqdzdbhtAFKTVhEdxKXlHoTihiGzUKlmkAP1FK8jIOg49KyTAcnLMKUvjOe1QxuXJPPNOL7gTSYD2bjjrSeZwe+KYDvfGetTS4jjA/vcU0wLfi0G40LT5urIGiY/TGK5hmAbk102pIbjwmxHSKYH8xiuXdSzilil71+6HTVkOz9aKWiuWyNbs9C+2H1oN1k4yKoPPt7Dg0hucYOOvtXDKPRnbFmkl0OeRVqzvSD1JrEE4B75q1aXByKUYBzHoHw6v3tdU8wA7QMkjp16fjgivQLq5RVV4nKGQgfLjn61w/wu8t9GuiVDGRwrA+mP/wBdblzetZ2ojPzJHjawHIwR1r38JS5aav1OOpUvLQ2CQzEuS5I25Y5xXY/AvxhBpPiiH7deraWioXkJBPmFWBA/MA/hXnR1KNU3FgQemDmmWc5h3PuO5zu57e1ephajpVFOPQ5aq54uL6n1h41vbDxLoyahFJFc2p/dzMhGJYWOGH/ASQw9CtfNnxI0V/CXiO5tJMYhkwG/vKeh/Kut+DHjQs9zolw/+j6nGyJk/cfGP1H9Kj+O9n/avhvT9SdQtymbS5xzll4z+YP6V9DjXHFYf2y3R5WHfsKvs3seO+JpN7xHuu7pWDPKHBrW1CQzuUJ+aNTn+lYNxLtB55r5SVj2I6KxX1C88pkJOBnFUprwspKo3PGalvpMhT6EVWmbeDn86w6sp6obDNttwMdCc+3NRTyAjpzTY3wHBOfm6ZpkkuB9aRJXu2IiYjqKjmbJX60t0x8lgO9Vr2QCAN3GKmTAgup/NkODkVBJxQ52njvSIN0mOaybLSGsdjg+1NkmVs4NLP8ANKfaoZFUDpz0pEpD1b92AeKGbC8dqikbBGDxRvPbmgqyJoHAY+uKkdtzKD61EpCkAelHmln+nSgTXY24ovN8K3S9jz+XNci3Dmux0w79CkX+8GrjplzKRxV4pK0RUndu4m8e9FM59qK47I3OxuZCpbqCKZCHmbHJrQ8Q2i2epug6E9qo21z5Ltg59KxqU7SaZUZuyY9m2PgjnuKmhm2EHOKovcZkJ7GpYp8dcmoUUi3I7v4ceJVsbp7eQ4SfGD6N/wDXrtDdY64ryHSb4W95E+TtDDP0r0uK4/0dMsCdvUHrXt4Gd4cr6HJWVpXRdMoRiQFHuBzQ11tAzVB73A9c0xr4A+/8q77dTBnQ+GtbOk65a3AbHkyK3XoAa9D+Lvi6yttL1LS5hIJLpku7chQVwQO/bkH868aju9rg5711XxPvm1Xwb4f1Lq6xtbSf7W3p/In869PDVnGhNL+kclSmnUi2cXcMBcyMSf3ij9KwLyTY7AHjNatxPuuFOcjbwfxrF1RgLlsDArxqnc7olW7kzGTnoKqStIy9VUH8SakuXLRsD3FVmlwoBJORmuaW5behVed4Z22tnOCcio5LtipPFMvphHN8vAxzURbPOaybaCw9rlpYnBPQZqK5fdbt7DNP58s8dR1qNxutyPUUm9LgitIcc9aSKQ7jSSHan40kZDE49KgsbJKysxHOTUDuXfB4/lUjDCVGTk/jQJO4hxk8U6PlsVGc7jUkByxPpQNkjHDrzTUfJPrRMSMY9aYr7BimwNqa4Np4fGOC/T865qb5JiO+a1dTvN1tBEOygms3UUBdGHdRmivLm2FFEOw0U+iuY1Ot17Uvtd+z56mqMR3ZOeKZcOQw96SFiQw7VE1eV2TFWiia3AaYCrM0fkyexqpp3/H1+FaN+Mxg96IxW5RFFLtIrvtJ1Ez6Vay7uNoRx+mf8+teeR87a6zwVO0ulyxsfl3/ANK7cJK0mjOorq50hmAOD1FMaU9qrWchlhUtyRx/Okdyp4Nemkcj3LIlK9TXdaJaL4z+FtxYxlWu7GYzRKTyfb8ckfjXnAlYjrVvRtbudFvUmtpWidG7dD7GuzC1FCTi1dPT7zKpG6v2M6ViropyCg5/lVHVFZpCy8jHOK2fFrbvE16QAoZ92B0yQCf1NZUvK59Qf5VyVVq49maqTsmYtzIzA4PaqYClVJycjuatXR+Y/WqcLbk57VxNmqbILmJdwAUDjGKheFoSM8qe/pVm4/4+U+hpHG5MHoazZRExIgP0qKR/LiA9BTXlYRMMk7c4zUDSs0oBPG2la4XsRSOXzkcelSKnlQ5zjPrTEGZBRfMSSO1Zra5oRMzYBAyP50wPuc9sVKB+7H0qM8SfhQKwjtgYzUsShEyc81ER89TP92gY2U/MD2zTCctTpBkfjTWODQAkrFyM8mmXa7reMjsSP5UE5kx6CnXI/wBAH+//AEqW7pj6leio6KxLP//Z";
      let bin = this.convertDataURIToBinary(b64img);
      this.classifyImage(bin).subscribe((res) => this.showAlert("OK4", String(res)));
    });
  }

  convertDataURIToBinary(dataURI) : Uint8Array {
    var raw = window.atob(dataURI);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selecionar Imagem",
      buttons: [{
        text: 'Carregar da Galeria',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Tirar Foto',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  classifyImage(bin: Uint8Array){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'image/jpeg'
        })
    };
    let body = bin;
    return this.http.post<string>(API + "recognize", body, httpOptions).pipe(
      take(1),
      map(res => {
        return res;
      }),
      switchMap(res => {
        return res;
      }),
      catchError(error => this.handleError(error))
    );
  }
  
  async handleError(error: any){
    let msg = "";
    if(error instanceof HttpErrorResponse){
      msg = "Ocorreu um erro ao estabelecer uma conexão com o servidor.";
    }else{
      msg = "Ocorreu um erro desconhecido.";
    }
    this.showAlert("Erro", msg);
  }

  async showAlert(hdr: string, msg: string){
    let alert = await this.alertCtrl.create({
      header: hdr,
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }
}
