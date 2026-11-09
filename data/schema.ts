import {z} from "zod";
const text=z.string().max(16000);
const required=text.trim().min(1,"Enter a value.");
const web=z.string().max(2000).url("Enter a complete https:// address.").regex(/^https?:\/\//i,"Use http or https.");
const optionalWeb=z.union([z.literal(""),web]);
const local=/^\/(?!\/)[\w./%-]+$/;
const asset=text.refine(v=>!v || local.test(v) || /^https:\/\//i.test(v),"Choose an uploaded file or enter an HTTPS URL.");
const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"Use lowercase letters, numbers and hyphens.");
const hex=z.string().regex(/^#[a-f\d]{6}$/i,"Use a six-digit hex colour.");
const list=<T extends z.ZodTypeAny>(item:T)=>z.array(item).max(500);
const strings=list(required);
const section=z.object({label:required,heading:required,menuLabel:required,visible:z.boolean()});
const project=z.object({
 title:required,short:required,slug,category:required,period:text,description:text,problem:text,solution:text,
 tech:strings,implementation:list(z.object({title:required,body:text})),features:strings,
 link:web,linkName:required,live:optionalWeb,image:asset,imageAlt:text,caption:text,
 additionalImage:asset,additionalCaption:text,guideTitle:text,guide:list(z.object({label:required,title:required,body:text,modules:strings})),progressGuide:z.boolean()
});
const repo=z.object({title:required,name:required.regex(/^[\w.-]+$/,"Use a GitHub repository name.").refine(v=>v!=="."&&v!=="..","Enter a repository name."),category:required,summary:text,url:web,language:text,status:z.enum(["source","readme","empty"]),upstream:optionalWeb,live:optionalWeb,caseStudy:text,screenshot:asset,files:list(z.object({name:required,type:z.enum(["file","dir"]),url:web}))});
export const contentSchema=z.object({
 profile:z.object({name:required,role:required,specialty:text,status:text,headline:required,introduction:text,location:text,portrait:asset,portraitAlt:text,resume:asset,email:z.string().email(),github:web,linkedin:web,workButton:required,resumeButton:required}),
 about:z.object({introduction:text,paragraphs:strings,university:text,location:text}),
 projects:list(project),repositories:list(repo),
 experience:list(z.object({role:required,org:required,date:text,place:text,type:text,body:text})),
 stack:list(z.object({title:required,technologies:strings})),
 education:list(z.object({title:required,period:text,institution:required})),
 certificates:list(z.object({title:required,issuer:required})),
 sections:z.object({work:section,about:section,experience:section,stack:section,education:section,contact:section}),
 contact:z.object({heading:required,highlight:text}),
 site:z.object({brand:required,brandSuffix:text,footer:text,title:required,description:text,socialImage:asset,accentDark:hex,accentLight:hex,archiveTitle:required,archiveLabel:required,contactButton:required}),
});
export type Content=z.infer<typeof contentSchema>;
export type Project=Content["projects"][number];
export type Repository=Content["repositories"][number];
export function validateDocument(value:unknown){
 const parsed=contentSchema.safeParse(value);
 if(!parsed.success){const issue=parsed.error.issues[0];throw new Error(issue.path.join(" › ")+" — "+issue.message);}
 const d=parsed.data;
 for(const ids of [d.projects.map(p=>p.slug),d.repositories.map(r=>r.name.toLowerCase())])if(new Set(ids).size!==ids.length)throw new Error("Each project address and repository name must be unique.");
 if(d.projects.some(p=>p.slug==="repositories"))throw new Error("Choose a different project address. Repositories is reserved for the archive.");
 const paths=new Set(d.projects.map(p=>"/work/"+p.slug+"/"));
 for(const r of d.repositories)if(r.caseStudy&&!paths.has(r.caseStudy))throw new Error("Choose an existing featured case study for "+r.title+" or clear its case study link.");
 return d;
}
