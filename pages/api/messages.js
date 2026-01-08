let messages = [];
const MAX_MSG = 100;

// Owner/Admin passwords
const ADMIN_PASSWORD = "admin01";
const OWNER_PASSWORD = "O#0363168";

export default function handler(req,res){
  if(req.method==="POST"){
    const { message, username, role } = req.body;

    // Login commands
    if(message.startsWith("!login")){
      if(message.split(" ")[1]===ADMIN_PASSWORD){ return res.status(200).json({ success:true, message:"Logged in as ADMIN", role:"admin" }); }
      return res.status(403).json({ success:false, message:"Wrong password" });
    }
    if(message.startsWith("!ownlogin")){
      if(message.split(" ")[1]===OWNER_PASSWORD){ return res.status(200).json({ success:true, message:"Logged in as OWNER", role:"owner" }); }
      return res.status(403).json({ success:false, message:"Wrong password" });
    }

    // Test command
    if(message.startsWith("!test")){
      if(role!=="owner" && role!=="admin"){ return res.status(403).json({ success:false, error:"Not authorized" }); }
      const testMessages = [
        { message:"Testing message sending...", username:"System", role:"owner" },
        { message:"Testing themes: classic, matrix, neon...", username:"System", role:"owner" },
        { message:"Testing badges: [OWNER], [ADMIN], [BETA]...", username:"System", role:"owner" },
        { message:"Testing typing indicator...", username:"System", role:"owner" }
      ];
      messages.push(...testMessages);
      if(messages.length>MAX_MSG) messages = messages.slice(-MAX_MSG);
      return res.status(200).json({ success:true, testRun:true, messages:testMessages });
    }

    // Normal message
    messages.push({ message, username:username||"User", role:role||"user" });
    if(messages.length>MAX_MSG) messages.shift();
    return res.status(200).json({ success:true });
  }

  if(req.method==="GET"){ return res.status(200).json(messages); }

  res.status(405).json({ error:"Method not allowed" });
}
