using System.Text;
using System.Text.Json.Serialization;
using backend.Data;
using backend.Helpers;
using backend.Hubs;
using backend.Interfaces;
using backend.Repositories;
using backend.Services;
using backend.Services.Author;
using backend.Services.Book;
using backend.Services.BookCopy;
using backend.Services.Category;
using backend.Services.Chat;
using backend.Services.Loan;
using backend.Services.Member;
using backend.Services.Staff;
using backend.Services.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://pablo11.duckdns.org")
                .AllowAnyHeader()
                .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .AllowCredentials();
        });
});

// ====================================
// CONFIGURE SERVICES
// ====================================

// 🔹 Database Context
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// 🔹 JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"))),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // Nếu request là tới /chatHub thì lấy token từ query string
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };

    });

// 🔹 Core Services
builder.Services.AddScoped<ITokenService, TokenService>();

// 🔹 Author Module
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();

// 🔹 Category Module
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// 🔹 Book Module
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IBookService, BookService>();

// 🔹 BookCopy Module
builder.Services.AddScoped<IBookCopyRepository, BookCopyRepository>();
builder.Services.AddScoped<IBookCopyService, BookCopyService>();

// 🔹 Member Module 
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IMemberService, MemberService>();

// 🔹 Staff Module 
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IStaffService, StaffService>();

// 🔹 Chat Module
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IChatService, ChatService>();

builder.Services.AddSignalR();

// Loan
builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<ILoanService, LoanService>();

// 🔹 Controllers
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(allowIntegerValues: true)
        );
    });

// 🔹 Swagger with JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Library Management API",
        Version = "v1",
        Description = "API for Library Management System"
    });

    // Add JWT Authentication
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 🔹 AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// 🔹 Minio Storage Service
builder.Services.Configure<MinioSettings>(builder.Configuration.GetSection("Minio"));
builder.Services.AddSingleton<IMinioService, MinioService>();

// ====================================
// BUILD APP
// ====================================

var app = builder.Build();

// ====================================
// AUTO MIGRATION
// ====================================

// Tự động migrate khi container khởi động
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LibraryDbContext>();
    db.Database.Migrate();
}

// ====================================
// CONFIGURE MIDDLEWARE PIPELINE
// ====================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Library Management API V1");
    });
}

app.UseCors("AllowReact");
app.UseHttpsRedirection();

app.UseAuthentication(); // Add this before UseAuthorization
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");
app.Run();