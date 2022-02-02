using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class HomeController : Controller
    {
        TicTacToeDBEntities db = new TicTacToeDBEntities();
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult DatabaseTables()
        {
            var tables = new DatabaseTables
            {
                players = db.PlayerTables.ToList(),
                gameplay = db.GamePlayTables.ToList(),
                playmove = db.PlayerMoveTables.ToList(),
                savegame = db.SavedGameTables.ToList()
            };
            return View(tables);
        }
    }
}