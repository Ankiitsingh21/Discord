// "use client"
import { MemberRole } from "@/lib/generated/prisma";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { channel } from "diagnostics_channel";

export async function DELETE(req:Request,{params}:{params:{channelId:string}}) {
        try {
                const profile = await currentProfile();
                const searchParams = new URL(req.url);

                const serverId = searchParams.searchParams.get("serverId");

                if(!profile){
                        return new NextResponse("Unauthorized",{status:401});
                }

                if(!serverId){
                        return new NextResponse("ServerId is missing",{status:401});
                }

                if(!params.channelId){
                        return new NextResponse("Channel_id is Misiing",{status:401});
                }

                const server = await db.server.update({
                        where:{
                                id:serverId,
                                members:{
                                        some:{
                                                profileId:profile.id,
                                                role:{
                                                        in:[MemberRole.ADMIN , MemberRole.MODERATOR]
                                                }
                                        }
                                }
                        },
                        data:{
                                channels:{
                                        delete:{
                                                id:params.channelId,
                                                name:{
                                                        not:"general"
                                                }
                                        }
                                }
                        }
                })

                console.log("deleted successfully");
                return NextResponse.json(server);

        } catch (error) {
                console.log(error);
                return new NextResponse("[CHannel_Id_DELETE]",{status:500});
        }
}

export async function PATCH(req:Request,{params}:{params:{channelId:string}}) {
        try {
                const profile = await currentProfile();
                const {name,type} = await req.json();
                const searchParams = new URL(req.url);

                const serverId = searchParams.searchParams.get("serverId");
                 if(!profile){
                        return new NextResponse("Unauthorized",{status:401});
                }
                 if(!serverId){
                        return new NextResponse("ServerId is missing",{status:401});
                }

                if(!params.channelId){
                        return new NextResponse("Channel_id is Misiing",{status:401});
                }

                if(name === "general"){
                    return new NextResponse("name cannot be general",{status:400}) 
                }

                const server = await db.server.update({
                        where:{
                                id:serverId,
                                members:{
                                        some:{
                                                profileId:profile.id,
                                                role:{
                                                        in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                                                }
                                        }
                                }
                        },
                        data:{
                                channels:{
                                        update:{
                                                where:{
                                                        id:params.channelId,
                                                        NOT:{
                                                                name:"general"
                                                        }
                                                },
                                                data:{
                                                        name,
                                                        type
                                                }
                                        }
                                }
                        }
                })

                return NextResponse.json(server);

        } catch (error) {
                console.log("CHANNELI_ID_PATCH",error);
                return new NextResponse("Internal server error",{status:501});
        }
}