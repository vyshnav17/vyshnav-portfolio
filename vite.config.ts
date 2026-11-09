import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { sites } from "./scripts/vite/sites-vite-plugin";
export default defineConfig({
  plugins:[vinext(),sites(),cloudflare({viteEnvironment:{name:"rsc",childEnvironments:["ssr"]},inspectorPort:false,config:{
    main:"./worker/index.ts",compatibility_date:"2026-05-15",compatibility_flags:["nodejs_compat"],
    d1_databases:[{binding:"DB",database_name:"portfolio",database_id:"00000000-0000-4000-8000-000000000000"}],
    r2_buckets:[{binding:"BUCKET",bucket_name:"portfolio-media"}]
  }})],
});
