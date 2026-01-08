let rooms = {};

export default function handler(req,res){
  const { action, roomPassword, username } = req.body || {};

  if(action==="create"){
    if(!rooms[roomPassword]) rooms[roomPassword] = { users:[username] };
    return res.status(200).json({ success:true });
  }
  if(action==="join"){
    if(rooms[roomPassword]) rooms[roomPassword].users.push(username);
    else return res.status(404).json({ success:false, error:"Room not found" });
    return res.status(200).json({ success:true });
  }

  res.status(405).json({ error:"Method not allowed" });
}
