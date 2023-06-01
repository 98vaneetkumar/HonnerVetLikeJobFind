function resetPassword(email,userType, env) {
	var newPassword = $("#newPassword").val();
	var confirmPassword = $("#confirmPassword").val();
	var token = $("#token").val();
	//var regexTest = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/g;
	var regexTest =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&])/;
	$("#newPassword").keyup(function() {
		$("#newPasswordErrDiv").html("");
	});
	$("#confirmPassword").keyup(function() {
		$("#confirmPasswordErrDiv").html("");
	});
	if (!newPassword) {
		$("#confirmPasswordErrDiv").html("");
		$("#newPasswordErrDiv").show().html("New Password is required");
		return false;
	} else if (!newPassword.match(regexTest)) {
		$("#confirmPasswordErrDiv").html("");
		$("#newPasswordErrDiv").show().html("Password must be at least 8 characters & maximum 20 characters long with 1 uppercase, 1 lowercase, 1 special character & 1 numeric character").css("color", "red");
		return false;
	} else if (newPassword.length < 8 || newPassword.length > 20) {
		$("#confirmPasswordErrDiv").html("");
		$("#newPasswordErrDiv").show().html("Password must be at least 8 characters & maximum 20 characters long with 1 uppercase, 1 lowercase, 1 special character & 1 numeric character").css("color", "red");
		return false;
	} else if (!confirmPassword) {
		$("#newPasswordErrDiv").html("");
		$("#confirmPasswordErrDiv").show().html("Confirm Password is required").css("color", "red");
		return false;
	} else if (confirmPassword.length < 8 || confirmPassword.length > 20) {
		$("#newPasswordErrDiv").html("");
		$("#confirmPasswordErrDiv").show().html("Password must be at least 8 characters & maximum 20 characters long with 1 uppercase, 1 lowercase, 1 special character & 1 numeric character").css("color", "red");
		return false;
	} else if (newPassword != confirmPassword) {
		$("#confirmPasswordErrDiv").show().html("");
		$("#confirmPasswordErrDiv").show().html("New Password and Confirm Password do not match").css("color", "red");
		return false;
	} else {
		$("#newPasswordErrDiv").show().html("");
		$("#confirmPasswordErrDiv").show().html("");
		// var accessToken="bearer "+localStorage.getItem("accessTokenAdmin");
		var url = baseUrl + "";
		// var baseUrlAdmin="http://localhost:3000/";
		// var baseUrlAdmin="https://lc0ekgayo5.execute-api.us-east-1.amazonaws.com/dev/";
		var baseUrlAdmin="https://w3jke9psob.execute-api.us-east-1.amazonaws.com/stage/";
		console.log("userType=====",userType);
		if (userType == "admin") {
			url = baseUrlAdmin + "admin/v1/admin/reset-password";
		}
		else if(userType=="recruiter"){
			url=baseUrlAdmin + "recruiter/v1/recruiter/reset-password";
		}
		else if (userType == "user") {
			url = baseUrl + "api/v1/user/resetEmailPassword";
		}
		else {
			url = baseUrl + "api/v1/coaches/resetEmailPassword";
		}
		
		var data = {
			newPassword: newPassword,
			token: token
		};
		if (userType == "user") {
			data.email = email;
		}
		$.ajax({
			type: "PUT",
			url: url,
			data: data,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log("error -----");
				if ((XMLHttpRequest) && (XMLHttpRequest.responseJSON) && (XMLHttpRequest.responseJSON.message)) {
					$("#confirmPasswordErrDiv").html(XMLHttpRequest.responseJSON.message).css("color", "red");
				} else {
					$("#confirmPasswordErrDiv").html("Something went wrong!").css("color", "red");
				}
				// console.log("window.location.hrefwindow.location.href .....", window.location.href);
			},
			success: function (data) {
				if (userType == "admin") {
					location.href = baseUrlAdmin + "admin/v1/admin/password-success";
				}
				else if(userType=="recruiter"){
					location.href = baseUrlAdmin + "recruiter/v1/recruiter/password-success";
				} else {
					location.href = baseUrl + "api/v1/user/passwordSuccess";
				}
			}
		});
	}
	
}