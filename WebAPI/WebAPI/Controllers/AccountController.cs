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
        TicTacToeDBEntities db = new TicTacToeDBEntities();
        // Register New Account
        [HttpPost]
        public object Register(PlayerTable User)
        {
            try
            {
                PlayerTable player = new PlayerTable();
                if (player.PlayerId == 0)
                {
                    //Validate if user already exist
                    bool userAlreadyExists = db.PlayerTables.Any(x => x.UserName == User.UserName);

                    if (userAlreadyExists)
                    {
                        return new Response
                        {
                            Status = "Error",
                            Message = "Invalid - Username already exist."
                        };
                    }
                    else
                    {
                        player.UserName = User.UserName;
                        player.Password = User.Password;
                        player.isLoggedIn = "N";

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
            try
            {
                var Obj = db.PlayerTables.Where(a => a.UserName == user.UserName && a.Password == user.Password).FirstOrDefault();

                if (Obj != null)
                {
                    UpdateLogginStatus(user.UserName, "Y");

                    return new Response
                    {
                        Status = "Success",
                        Message = user.UserName
                    };
                }
                else
                {
                    return new Response
                    {
                        Status = "Invalid",
                        Message = "Invalid Username or Password."
                    };
                }
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

        //method to Logout from the system
        [HttpPost]
        public Response Logout(string username)
        {
            UpdateLogginStatus(username, "N");

            return new Response
            {
                Status = "Success",
                Message = "Logout Successfully"
            };
        }

        // Update user's login status.
        protected void UpdateLogginStatus(string Username, string status)
        {
            PlayerTable update = (from p in db.PlayerTables
                                  where p.UserName == Username
                                  select p).SingleOrDefault();

            update.isLoggedIn = status;
            db.SaveChanges();
        }

        //Get the current userId based on username
        [HttpPost]
        public IHttpActionResult getUserId(string username)
        {
            var user = db.PlayerTables.Where(a => a.UserName == username).FirstOrDefault();
            return Json(user.PlayerId);
        }
    }
}
