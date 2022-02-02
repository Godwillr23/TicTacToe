using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class DatabaseTables
    {
        public List<PlayerTable> players { get; set; }
        public List<GamePlayTable> gameplay { get; set; }
        public List<PlayerMoveTable> playmove { get; set; }
        public List<SavedGameTable> savegame { get; set; }
    }
}