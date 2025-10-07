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
import os


def sendverificationmail(request, VERIFICATION_SECRET_KEY):
    # Allow disabling emails in development to avoid timeouts or blocking behavior
    if os.environ.get('SUPPRESS_EMAILS', '').lower() in ('1', 'true', 'yes'):
        print('SUPPRESS_EMAILS set - skipping sendverificationmail')
        return
    sender_email = "info@sitcloud.in"
    receiver_email = request.json.get("email")
    message = MIMEMultipart()
    message["Subject"] = "Test SIT Registration verification link"
    message["From"] = sender_email
    message["To"] = receiver_email

    server = None
    try:
        # Try SMTP with STARTTLS first
        try:
            server = smtplib.SMTP('smtp-mail.outlook.com', 587, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
        except (smtplib.SMTPNotSupportedError, smtplib.SMTPException):
            # Fallback to SSL if STARTTLS is not supported
            if server:
                try:
                    server.close()
                except Exception:
                    pass
            server = smtplib.SMTP_SSL('smtp-mail.outlook.com', 465, timeout=10)
            server.ehlo()

        server.login("info@sitcloud.in", "skzvqzjnrcbrfznn")

        token = jwt.encode({
            'email': request.json.get("email"),
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, VERIFICATION_SECRET_KEY)

        confirm_url = "https://sitcloud.in/api/verify?token=" + token
        first = request.json.get('firstName', '')
        last = request.json.get('lastName', '')
        body = f"""
            <html>
              <head></head>
              <body>
            Hi {first} {last}.<br>
            <p>Welcome! Thanks for signing up.</p>
            <p>Please follow this link to activate your account:</p>
            <p><a href=\"{confirm_url}\">{confirm_url}</a></p><br><p>Cheers!</p>
              </body>
            </html>
            """

        message.attach(MIMEText(body, 'html'))
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)
    except Exception as e:
        print("sendverificationmail failed:", e)
        raise
    finally:
        if server:
            try:
                server.quit()
            except Exception:
                try:
                    server.close()
                except Exception:
                    pass


def sendenquirymail(request):
    if os.environ.get('SUPPRESS_EMAILS', '').lower() in ('1', 'true', 'yes'):
        print('SUPPRESS_EMAILS set - skipping sendenquirymail')
        return
    sender_email = "info@sitcloud.in"
    receiver_email = "info@sitcloud.in"
    message = MIMEMultipart()
    message["Subject"] = "Enquiry request from " + request.json.get('name', '')
    message["From"] = sender_email
    message["To"] = receiver_email

    server = None
    try:
        try:
            server = smtplib.SMTP('smtp-mail.outlook.com', 587, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
        except (smtplib.SMTPNotSupportedError, smtplib.SMTPException):
            if server:
                try:
                    server.close()
                except Exception:
                    pass
            server = smtplib.SMTP_SSL('smtp-mail.outlook.com', 465, timeout=10)
            server.ehlo()

        server.login("info@sitcloud.in", "skzvqzjnrcbrfznn")
        body = f"""
                <html>
                  <head></head>
                  <body>
                Hi SitTeam.<br>
                <p>You received an enquiry from {request.json.get('name','')}.</p>
                <p>Here are the details:</p>
                <b>Name:</b> {request.json.get('name','')}<br>
                <b>Email:</b> {request.json.get('email','')}<br>
                <b>Phone:</b> {request.json.get('phone','Not provided')}<br>
                <b>Course:</b> {request.json.get('course','Not specified')}<br>
                <b>Batch:</b> {request.json.get('batch','Not specified')}<br>
                <b>Enquiry:</b> {request.json.get('enquiry', request.json.get('message','No message'))}<br>
                  </body>
                </html>
                """
        message.attach(MIMEText(body, 'html'))
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)
    except Exception as e:
        print('sendenquirymail failed:', e)
        raise
    finally:
        if server:
            try:
                server.quit()
            except Exception:
                try:
                    server.close()
                except Exception:
                    pass


def sendcertmail(request):
    if os.environ.get('SUPPRESS_EMAILS', '').lower() in ('1', 'true', 'yes'):
        print('SUPPRESS_EMAILS set - skipping sendcertmail')
        return
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

    server = None
    try:
        try:
            server = smtplib.SMTP('smtp-mail.outlook.com', 587, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
        except (smtplib.SMTPNotSupportedError, smtplib.SMTPException):
            if server:
                try:
                    server.close()
                except Exception:
                    pass
            server = smtplib.SMTP_SSL('smtp-mail.outlook.com', 465, timeout=10)
            server.ehlo()

        server.login("info@sitcloud.in", "skzvqzjnrcbrfznn")
        server.sendmail(message['From'], message['To'], message.as_string())
    except Exception as e:
        print('sendcertmail failed:', e)
        raise
    finally:
        if server:
            try:
                server.quit()
            except Exception:
                try:
                    server.close()
                except Exception:
                    pass
