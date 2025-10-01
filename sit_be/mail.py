from email.encoders import encode_base64
from email.mime.application import MIMEApplication
from email.mime.base import MIMEBase

from flask_mail import Mail, Message
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from datetime import datetime, timedelta
import jwt
from email.message import EmailMessage
from email import encoders


def sendverificationmail(request, VERIFICATION_SECRET_KEY):
    server = smtplib.SMTP('smtp-mail.outlook.com', 587)
    server.ehlo()
    server.starttls()
    server.login("info@sitcloud.in", "skzvqzjnrcbrfznn")

    sender_email = "info@sitcloud.in"
    receiver_email = request.json["email"]
    message = MIMEMultipart()
    message["Subject"] = "Test SIT Registration verification link"
    message["From"] = sender_email
    message["To"] = receiver_email
    token = jwt.encode({
        'email': request.json["email"],
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }, VERIFICATION_SECRET_KEY)
    # convert both parts to MIMEText objects and add them to the MIMEMultipart message
    confirm_url = "https://sitcloud.in/api/verify?token=" + token
    body = """\
            <html>
              <head></head>
              <body>
            Hi """ + request.json['firstName'] + """ """ + request.json['lastName'] + """.<br>
            <p>Welcome! Thanks for signing up.</p>
            <p>Please follow this link to activate your account:</p>
            <p><a href=""" + confirm_url + """ > """ + confirm_url + """</a></p><br><p>Cheers!</p>
              </body>
            </html>
            """
    message.attach(MIMEText(body, 'html'))
    text = message.as_string()
    server.sendmail("info@sitcloud.in", request.json['email'], text)
    server.close()


def sendenquirymail(request):
    server = smtplib.SMTP('smtp-mail.outlook.com', 587)
    server.ehlo()
    server.starttls()
    server.login("info@sitcloud.in", "skzvqzjnrcbrfznn")

    sender_email = "info@sitcloud.in"
    receiver_email = "info@sitcloud.in"
    message = MIMEMultipart()
    message["Subject"] = "Enquiry request from " + request.json['name']
    message["From"] = sender_email
    message["To"] = receiver_email
    body = """\
                <html>
                  <head></head>
                  <body>
                Hi SitTeam.<br>
                <p>You received an enquiry from """ + request.json['name'] + """.</p>
                <p>Here are the details:</p>
                <b>Name:</b> """ + request.json['name'] + """<br>
                <b>Email:</b> """ + request.json['email'] + """<br>
                <b>Phone:</b> """ + request.json.get('phone', 'Not provided') + """<br>
                <b>Course:</b> """ + request.json.get('course', 'Not specified') + """<br>
                <b>Batch:</b> """ + request.json.get('batch', 'Not specified') + """<br>
                <b>Enquiry:</b> """ + request.json.get('enquiry', request.json.get('message', 'No message')) + """<br>
                  </body>
                </html>
                """
    message.attach(MIMEText(body, 'html'))
    text = message.as_string()
    server.sendmail("info@sitcloud.in", receiver_email, text)
    server.close()


def sendcertmail(request):
    message = MIMEMultipart()
    message['Subject'] = "Attachment Test"
    message['From'] = 'info@sitcloud.in'
    message['To'] = 'info@sitcloud.in'

    text = MIMEText("Message Body")
    message.attach(text)

    directory = "templates/test.pdf"
    with open(directory, "rb") as opened:
        openedfile = opened.read()
    attachedfile = MIMEApplication(openedfile, _subtype = "pdf", _encoder = encode_base64)
    attachedfile.add_header('content-disposition', 'attachment', filename = "ExamplePDF.pdf")
    message.attach(attachedfile)

    server = smtplib.SMTP("smtp-mail.outlook.com:587")
    server.ehlo()
    server.starttls()
    server.login("info@sitcloud.in", "skzvqzjnrcbrfznn")
    server.sendmail(message['From'], message['To'], message.as_string())
    server.quit()
