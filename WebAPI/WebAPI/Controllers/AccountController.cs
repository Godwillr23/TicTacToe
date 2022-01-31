using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using WebAPI.Models;
using WebAPI.Results;
using System.Linq;

namespace WebAPI.Controllers
{
    [RoutePrefix("api/account")]
    public class AccountController : ApiController
    {
        // Register New Account
       [HttpPost]
       public object Register(Registration User)  
       {  
           try  
           {  
               TicTacToeDBEntities db = new TicTacToeDBEntities();  
               PlayerTable player = new PlayerTable();  
               if (player.UserId == 0)  
               {
                    bool userAlreadyExists = db.PlayerTables.Any(x => x.UserName == User.UserName);

                    if (userAlreadyExists)
                    {
                        return new Response
                        { Status = "Error", Message = "Invalid - Username already exist." };
                    }
                    else {
                        player.UserName = User.UserName;
                        player.Password = User.Password;

                        db.PlayerTables.Add(player);
                        db.SaveChanges();

                        return new Response
                        {
                            Status = "Success",
                            Message = "Account Added."
                        };
                    }
               }  
           }  
           catch (Exception)  
           {  
               throw;  
           }  
           return new Response  
           { Status = "Error", Message = "Invalid." };  
       }

        //For user login   
        //[HttpPost]
        [HttpPost]
        public Response Login(PlayerTable user)
        {
            TicTacToeDBEntities DB = new TicTacToeDBEntities();

            try
            {
                var Obj = DB.PlayerTables.Where(a => a.UserName == user.UserName && a.Password == user.Password).FirstOrDefault();

                if (Obj != null)
                    return new Response
                    {
                        Status = "Success",
                        Message = user.UserName
                    };
                else
                    return new Response
                    {
                        Status = "Invalid",
                        Message = "Invalid Username or Password."
                    };
            }
            catch (Exception e)
            {
                return new Response
                {
                    Status = "Invalid",
                    Message = e.InnerException.ToString()
                };
            }
        }
    }
}
