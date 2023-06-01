exports.forgotPasswordAdmin = `
<!DOCTYPE html>
<html style='height:100%;'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta name='viewport' content='width=device-width' />
    <title>HonorVet</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style='margin:0px; padding:0px; height:100%; font-family:Roboto, sans-serif !important;'>
    <table style='vertical-align:top; font-family:Roboto, sans-serif; color:#3a3a3a;font-size:14px; background: #EFF2FD; ' width='100%' height='100%' border='0' cellspacing='20' cellpadding='0'>
        <tr>
            <td>
                <table cellspacing='0' cellpadding='0' style='max-width:600px; background: #fff;width:100%; margin:0 auto;padding:0;box-sizing:border-box;border-collapse:collapse; box-shadow: 0px 1px 2px 1px rgba(154, 154, 204, 0.22); border-radius: 13px;'>
                    <tr>
                        <td style='margin:0px;padding:35px 0px 20px; text-align:center;height:50px; width:100%; box-sizing:border-box; '> <img src="{{s3Url}}logo.png" width="auto;" style="border-radius:10px;"> </td>
                    </tr>
                    <tr>
                        <td style=''>
                            <table cellspacing='0' cellpadding='0' style='padding:20px 20px; width:100%; box-sizing:border-box;'>
                                <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 10px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; text-align: center;" >
                                  <p style="margin: 0;">Hey {{user_name}},</p>
                                </td>
                                </tr>
                                <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; text-align: center;" >
                                  <p style="margin: 0;">We've received a request to reset the password for your HonorVet account.Click below to reset your password</p>
                                </td>
                                </tr>
                                <tr>
                                   <!-- <td style='text-align:center; padding:0px'><p style = "font-size: 20px; font-style: bold">{{otp}}</p></td>-->
                                    <td align="center" style="border-radius: 3px;"><a href="{{resetPasswordToken}}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; display: inline-block; background-image: linear-gradient(#ebbf46, #db9226); width: 200px; border-radius: 65px; margin-bottom: 20px;"> Reset Password</a></td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                    <!-- <tr>
                        <td style='padding:20px 0px 70px;width:100%;box-sizing:border-box; text-align:center; '> <a href='{{privacyUrl}}' style='display:inline-block; color:#333; margin:0px 2px 5px; font-size:12px; text-decoration:underline'>Privacy Policy</a> <a href='{{termsUrl}}' style='display:inline-block; color:#333; margin:0px 2px 5px; font-size:12px; text-decoration:underline;'>Terms &amp; Conditions </a>
                            <p style='margin:0px;color:#333;font-size:12px;'>Copyright &copy; 2022 All Rights Reserved</p>
                        </td>
                    </tr> -->
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;