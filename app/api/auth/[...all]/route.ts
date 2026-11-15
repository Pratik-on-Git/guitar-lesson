import { getAuth } from "@/lib/auth";

async function handle(request: Request) {
  try {
    return await getAuth().handler(request);
  } catch {
    return Response.json({ message: "Unable to reach the account service. Please try again shortly." }, { status: 503 });
  }
}

export { handle as GET, handle as POST };
