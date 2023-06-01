exports.adminRecruiterApproved =`<html style='height:100%;'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta name='viewport' content='width=device-width' />
    <title>Recruiter Status</title>
</head>
<body style="margin:0px; padding:0px; height:100%; ">
    <table
        style="vertical-align:top; font-family:Arial, Helvetica, sans-serif; color:#333;font-size:14px; background:#f2f3fa; "
        width="100%" height="100%" border="0" cellspacing="20" cellpadding="0">
        <tr>
            <td>
                <table cellspacing="0" cellpadding="0"
                    style="max-width:600px; background:#fff; width:100%; margin:0 auto;padding:0;box-sizing:border-box;border-collapse:collapse;  box-shadow: 0 0 15px #ccc;">
                    <tr>
                        <td
                            style="margin:0px;padding:60px 0px 20px; text-align:center; width:100%;  box-sizing:border-box; ">
                            <img src="{{s3logo}}" / width="100" height="45" style="width: 100; height: 45">
                        </td>
                    </tr>
                    <tr>
                        <td style="">
                            <table cellspacing="0" cellpadding="0"
                                style="padding:20px 20px; width:100%; box-sizing:border-box;">
                                <tr>
                                    <td style="margin:0px;">
                                        <h2
                                            style="font-size:16px;font-weight:600;font-size:20px; color:#000; text-align:center;text-transform:uppercase;margin:0px; ">
                                            HonorVet Recruiter Status</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style="margin:0px;text-align:center;padding:40px 30px;line-height: 23px; font-size:16px;color:#3a3a3a;">
                                        Hello there! You have been added as Admin by the HonorVet Administrator </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 5px 5px">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        
                                                        <tr>
                                                            <td align="left"><strong>Email</strong></td>
                                                            <td align="center"><strong>:&nbsp;</strong></td>
                                                            <td align="left"> {{email}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left"><strong>Status</strong></td>
                                                            <td align="center"><strong>:&nbsp;</strong></td>
                                                            <td align="left"> {{reason}}</td>
                                                        </tr>
                                                        
                                                        
                
                                                        
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
    </table>
</body>
</html>`;