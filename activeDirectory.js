var express = require('express');
var app = express();
var ldap = require('ldapjs')
//var ldap = require('ldapjs');
app.use(express.Router("username","password"))


app.listen(3001, function () {
    console.log("server started")
})


var client = ldap.createClient({
    url: 'ldap://172.16.8.192:389'
});

function authenticateDN(username, password) {

    /*bind use for authentication*/
    client.bind(username, password, function (err) {
        if (err) {
            console.log("Error in new connetion " + err)
        } else {
            /*if connection is success then go for any operation*/
            console.log("Success");
            //testFunction()
            // app.get('/get/:id', (req, res) => {
            //     let userName = req.params.id
            //     console.log("UserName", userName)
            //     searchUser(userName, res)

            // });
            app.get('/Banglalink/getusers/', (req, res) => {
                let userName = req.params.id
                console.log("UserName", userName)
                searchUser(userName, res)
            });
            //searchUser("Shahnewaz")
           // addUser()
            //deleteUser() 
            //updateUser('CN=Uesr3,DC=bltestdomain,DC=com')
        }

    });
}

function searchUser(param, resp) {
    console.log(param)
    var results = []
    var opts = {
        filter: '(objectClass=*)',  //simple search
        //filter: '(&(uid=2)(sn=John))',// and search
        //filter: '(|(uid=2)(sn=' + param + ')(cn=Smith))', // or search
        scope: 'sub',
        attributes: ['sn', 'cn', 'uid', 'displayName', 'mail', 'pager']
    };

    client.search('ou=BanglalinkTest,DC=bltestdomain,DC=com', opts, function (err, res) {
        if (err) {
            console.log("Error in search " + err)
        } else {
            res.on('searchEntry', function (entry) {
                console.log('entry: ' + JSON.stringify(entry.object));
                results.push(entry.object)
            });


            res.on('searchReference', function (referral) {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', function (err) {
                console.error('error: ' + err.message);
            });
            res.on('end', function (result) {
                console.log('status: ' + result.status);
                //console.log('resultss: ' + JSON.stringify(results));
                resp.send(JSON.stringify(results))
            });
        }
    });
    //resp.send("success")
}

/*use this to add user*/
function addUser() {
    var entry = {
        cn: 'Test10',
        //sn: 'Test_Mailbox_3',
        sAMAccountName: 'Test10',
        pager: 'Test123456',
        givenName: 'Test 6 Givan Name',
        sn: 'Test 10',
        displayName: 'Test 6 Display Name',
        title: 'Test 6 title',
        department: 'Test Department',
        company: 'Test Company',
        mobile:'9999999999',
        streetAddress:'India',
        mail: ['test6@gmail.com'],
        objectClass: 'organizationalPerson'
    };
    //console.log("entry", entry)
    client.add('cn=Test10,OU=BanglalinkTest,DC=bltestdomain,DC=com', entry, function (err) {
        console.log("Added", entry)
        if (err) {
            console.log("err in new user " + err);
        } else {
            console.log("added user")
        }
    });
}
/*use this to delete user*/
function deleteUser() {
    client.del('CN=user7,DC=bltestdomain,DC=com', function (err) {
        if (err) {
            console.log("err in delete new user " + err);
        } else {
            console.log("deleted user")
        }
    });
}
/*use this to update user attributes*/
function updateUser(dn) {
    var change = new ldap.Change({
        operation: 'replace',  //use add to add new attribute
        //operation: 'replace', // use replace to update the existing attribute
        modification: {
            displayName: 'User3'
        }
    });

    client.modify(dn, change, function (err) {
        if (err) {
            console.log("err in update user " + err);
        } else {
            console.log("add update user");
        }
    });
}

let auth = authenticateDN('essintegrationtest@bltestdomain.com', 'BL@1234567890')