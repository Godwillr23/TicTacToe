using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Response
    {
        public string Status { set; get; }
        public string Message { set; get; }
    }

    public class GetUserId
    {
        public int UserId { set; get; }
    }

    public class GetGamePlayId
    {
        public int GamePlayId { set; get; }
    }
}