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
    [RoutePrefix("api/gameplay")]
    public class GamePlayController : ApiController
    {
        TicTacToeDBEntities db = new TicTacToeDBEntities();

        // Create game Play
        [HttpPost]
        public IHttpActionResult CreateGamePlay (GamePlayTable game)
        {
            Response resp;

            try
            {
                GamePlayTable gameplay = new GamePlayTable();

                gameplay.GamePlayType = game.GamePlayType;
                gameplay.GameResults = game.GameResults;
                gameplay.GameCode = game.GameCode;
                gameplay.UserName = game.UserName;
                gameplay.DateCreated = DateTime.Now.Date;

                db.GamePlayTables.Add(gameplay);
                db.SaveChanges();

                resp = new Response
                {
                    Status = "Success",
                    Message = "Game Play Created."
                };
            }
            catch (Exception ex)
            {
                resp = new Response
                {
                    Status = "Error",
                    Message = ex.InnerException.ToString()
                };
            }

            return Json(resp);
        }

        // Create game Play
        [HttpPost]
        public IHttpActionResult SaveGamePlay(SavedGameTable game)
        {
            Response resp;

            try
            {
                SavedGameTable gameplay = new SavedGameTable();

                gameplay.GameCode = game.GameCode;
                gameplay.Challenge = game.Challenge;

                db.SavedGameTables.Add(gameplay);
                db.SaveChanges();

                resp = new Response
                {
                    Status = "Success",
                    Message = "Game Play Saved Successfully."
                };
            }
            catch (Exception ex)
            {
                resp = new Response
                {
                    Status = "Error",
                    Message = ex.InnerException.ToString()
                };
            }

            return Json(resp);
        }

        // Player Move
        [HttpPost]
        public IHttpActionResult PlayMove(PlayerMoveTable game)
        {
            Response resp;

            try
            {
                PlayerMoveTable move = new PlayerMoveTable();

                move.GameCode = game.GameCode;
                move.MoveYX = game.MoveYX;
                move.BackColor = game.BackColor;

                db.PlayerMoveTables.Add(move);
                db.SaveChanges();

                resp = new Response
                {
                    Status = "Success",
                    Message = "Moved Successfully."
                };
            }
            catch (Exception ex)
            {
                resp = new Response
                {
                    Status = "Error",
                    Message = ex.InnerException.ToString()
                };
            }

            return Json(resp);
        }
        public IHttpActionResult LatestGamePlayByUserId(string username)
        {
            var gameplay = db.GamePlayTables.OrderByDescending(x=>x.GamePlayId).Where(a=> a.UserName == username).FirstOrDefault();

            return Json(gameplay);
        }

        public IHttpActionResult ResumeGame(string gameCode)
        {
            var game = db.PlayerMoveTables.Where(a => a.GameCode == gameCode).FirstOrDefault();

            return Json(game);
        }

        public IHttpActionResult SavedGame(string gameCode)
        {
            var game = db.SavedGameTables.Where(a => a.GameCode == gameCode).FirstOrDefault();

            return Json(game);
        }
    }
}