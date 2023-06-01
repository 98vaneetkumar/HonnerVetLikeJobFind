exports.emailNotification = `
<!DOCTYPE html>
<html style='height:100%;'>

<head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta name='viewport' content='width=device-width' />
    <title>Verification Email</title>
</head>

<body style='margin:0px; padding:0px; height:100%;'>
    <table style='vertical-align:top; font-family:Arial, Helvetica, sans-serif; color:#3a3a3a;font-size:14px; background: #EFF2FD; ' width='100%' height='100%' border='0' cellspacing='20' cellpadding='0'>
        <tr>
            <td>
                <table cellspacing='0' cellpadding='0' style='max-width:600px; background: #fff;width:100%; margin:0 auto;padding:0;box-sizing:border-box;border-collapse:collapse; box-shadow: 0px 1px 2px 1px rgba(154, 154, 204, 0.22);'>
                    <tr>
                        <td style='margin:0px;padding:55px 0px 20px; text-align:center;height:50px; width:100%; box-sizing:border-box; '> <img src="{{s3Url}}logo.png" width="150px;" style="border-radius:10px;"> </td>
                    </tr>
                    <tr>
                        <td style=''>
                            <table cellspacing='0' cellpadding='0' style='padding:20px 20px; width:100%; box-sizing:border-box;'>
                                <tr>
                                    <td style='margin:0px;'>
                                        <h2 style='font-size:16px;font-weight:600;font-size:20px; color:#000; text-align:center;text-transform:uppercase;margin:0px; '> Email notification </h2></td>
                                </tr>
                                <tr>
                                    <td style='margin:0px;text-align:center;padding:20px 30px;'>
                                        <p style=" line-height: 23px; font-size:16px;color:#3a3a3a;">Hello {{name}}, Same credentials are using on </p>
                                        <p style=" line-height: 23px; font-size:16px;color:#3a3a3a;margin: 0px;"><strong> Platform </strong> {{deviceName}} </p>
                                        <p style=" line-height: 23px; font-size:16px;color:#3a3a3a;margin: 0px;"><strong> Login Time </strong> {{loginDate}} </p>
                                        <p style=" line-height: 23px; font-size:16px;color:#3a3a3a; margin-top: 5px;"><strong> IP Address </strong> {{ipAddress}} </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding:20px 0px 70px;width:100%;box-sizing:border-box; text-align:center; '> <a href='{{privacyUrl}}' style='display:inline-block; color:#333; margin:0px 2px 5px; font-size:12px; text-decoration:underline'> Privacy Policy </a> <a href='{{termsUrl}}' style='display:inline-block; color:#333; margin:0px 2px 5px; font-size:12px; text-decoration:underline;'>Terms &amp; Conditions </a>
                            <p style='margin:0px;color:#333;font-size:12px;'> Copyright &copy; 2023 All Rights Reserved </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
`;