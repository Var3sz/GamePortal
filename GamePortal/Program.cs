using GamePortal.Extensions;


var builder = WebApplication.CreateBuilder(args);

// Add different services through own extension class
builder.Services.AddApplicationExtension(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) { }

app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("CorsPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
