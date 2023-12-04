using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class CourseController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public CourseController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpPut("active/{id}")]
    public async Task<IActionResult> CHangeActive([FromRoute] string id, [FromBody] CourseChangeActiveRequest courseChangeActiveRequest )
    {

        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            await dbContext.Courses.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                .SetProperty(u => u.Active, u => courseChangeActiveRequest.Active)
                
            );

            var courseExists = await dbContext.Courses.Select(
            c => new {
                c.Id,
                c.Name,
                c.Active,
                c.Description,
                c.ImgUrl,
                c.SubjectId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            return Ok(courseExists);

        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page, [FromQuery] string? search="")
    {

        try{
            
            if(search == ""){
                var courses = await dbContext.Courses.Where(c=>c.Active == true).Skip((page - 1) * 5).Take(5).OrderByDescending(c=> c.CreatedAt).Select(
                c => new {
                c.Id,
                c.Name,
                c.Active,
                c.Description,
                c.ImgUrl,
                c.SubjectId,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(new {
                courses,
                count= Math.Ceiling((await dbContext.Courses.Where(c=>c.Active == true).CountAsync()) / 5.0)
            });
            }else{
                var courses = await dbContext
                .Courses
                .Where(c=> c.Name.Trim().ToLower().Contains(search.Trim().ToLower()) && c.Active == true )
                .Skip((page - 1) * 5).Take(5)
                .OrderByDescending(c=> c.CreatedAt)
                .Select(
                    c => new {
                        c.Id,
                        c.Name,
                        c.Active,
                        c.Description,
                        c.ImgUrl,
                        c.SubjectId,
                        c.CreatedAt,
                        c.UpdatedAt
                    }
            ).ToListAsync();

            return Ok(new{
                courses,
                count= Math.Ceiling((await dbContext.Courses
                .Where(c=> c.Name.Trim().ToLower().Contains(search.Trim().ToLower()) && c.Active == true).CountAsync()) / 5.0)
            });
            }

        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("ListbySubject")]
      public async Task<IActionResult> ListbySubject([FromQuery] int page, [FromQuery] int subjectId, [FromQuery] string? search="")
        {
            if(page == null )
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }

            try{
                if( search == ""){
                    var courses = await dbContext.Courses
                    .Where(cc => cc.SubjectId == subjectId)
                    .OrderBy(cc => cc.CreatedAt)
                    .Skip((page - 1) * 10)
                    .Take(10)
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Active,
                        c.ImgUrl,
                        c.CreatedAt,
                        c.UpdatedAt

                    })
                    .ToListAsync();

                return Ok(new {
                    courses,
                   count =  Math.Ceiling(
                    (await dbContext.Courses.Where(c=> c.SubjectId == subjectId).CountAsync()) / 10.0)
                });
                }
                else{
                    var courses = await dbContext.Courses
                    .Where(cc => cc.SubjectId == subjectId && cc.Name.ToLower().Trim().Contains(search.ToLower().Trim()))
                    .OrderBy(cc => cc.CreatedAt)
                    .Skip((page - 1) * 10)
                    .Take(10)
                    .Select(c => new {
                        c.Id,
                        c.Name,
                        c.Active,
                        c.ImgUrl,
                        c.CreatedAt,
                        c.UpdatedAt

                    })
                    .ToListAsync();

                return Ok(new {
                    courses,
                    count =  Math.Ceiling(
                        (await dbContext.Courses.Where(c=> c.SubjectId == subjectId && c.Name.ToLower().Trim().Contains(search.ToLower().Trim())).CountAsync()) / 10.0
                    )     
                    
                });
                }
            }
            catch(Exception e){
            _logger.LogError(e.Message);
                return BadRequest(ApplicationError.appError);
            }
        }

     [HttpGet("ListbyCustomer")]
      public async Task<IActionResult> ListbyCustomer([FromQuery] int page, [FromQuery] string customerId, [FromQuery] string? search="")
    {
        if(page == null || customerId == null)
        {
            return BadRequest(ApplicationError.requiredParamtersNotSupplied);
        }

        try{
            if(search==""){
                var courses = await dbContext.Customercourses
                .Include(cc => cc.Course)
                .ThenInclude(cc=>cc.Subject)
                .Where(cc => cc.CustomerId.ToString() == customerId && cc.Course != null && cc.Course.Active == true)
                .OrderBy(cc => cc.CreatedAt)
                .Skip((page - 1) * 10)
                .Take(10)
               
                .Select(c => new {
                    c.Course.Id,
                    c.Course.Name,
                    c.Course.Description,
                    c.Course.ImgUrl,
                    subject=c.Course.Subject.Name,
                    c.Course.CreatedAt,
                    c.Course.UpdatedAt,

                })
                .ToListAsync();

            return Ok( new {
                courses,
                count=Math.Ceiling((await  dbContext.Customercourses
                .Include(cc => cc.Course)
                .ThenInclude(cc=>cc.Subject)
                .Where(cc => cc.CustomerId.ToString() == customerId && cc.Course != null && cc.Course.Active == true).CountAsync())/ 10.0)
            });
            }else{
                var courses = await dbContext.Customercourses
                .Include(cc => cc.Course)
                .ThenInclude(cc=>cc.Subject)
                .Where(cc => cc.CustomerId.ToString() == customerId && cc.Course != null
                    && cc.Course.Name.ToLower().Contains(search.ToLower()) && cc.Course.Active == true
                )
                .OrderBy(cc => cc.CreatedAt)
                .Skip((page - 1) * 10)
                .Take(10)
               
                .Select(c => new {
                    c.Course.Id,
                    c.Course.Name,
                    c.Course.Description,
                    c.Course.ImgUrl,
                    subject=c.Course.Subject.Name,
                    c.Course.CreatedAt,
                    c.Course.UpdatedAt,

                })
                .ToListAsync();

            return Ok( new {
                courses,
                count=Math.Ceiling((await  dbContext.Customercourses
                .Include(cc => cc.Course)
                .ThenInclude(cc=>cc.Subject)
                .Where(cc => 
                    cc.CustomerId.ToString() == customerId && cc.Course != null
                     && cc.Course.Name.ToLower().Contains(search.ToLower())
                    && cc.Course.Active == true
                ).CountAsync())/ 10.0)
            });
            }
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get([FromRoute] string id)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var courseExists = await dbContext.Courses
            .Include(c=> c.Subject)
            .Include(c=> c.Chapters)
            .Select(
            c => new {
                c.Id,
                c.Name,
                c.Active,
                c.Description,
                c.ImgUrl,
                Subject=c.Subject.Name, 
                c.Chapters,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(courseExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(courseExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string id )
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Courses.Where(c => c.Id.ToString() == id)
            .ExecuteDeleteAsync();
            
         

            return Ok();
        }
        catch(Exception e){
            System.Console.WriteLine(e);
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id ,[FromBody] CourseUpdateRequest courseCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            await dbContext.Courses.Where(c => c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c => c.Name, c => courseCreateRequest.Name)
                .SetProperty(c => c.Description,  c => courseCreateRequest.Description)
                .SetProperty(c => c.Price,  c => courseCreateRequest.Price)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var courseExists = await dbContext.Courses.Select(
            c => new {
                c.Id,
                c.Name,
                c.Active,
                c.Description,
                c.ImgUrl,
                c.SubjectId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(courseExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(courseExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

     [HttpPut("image/{id}")]
    public async Task<IActionResult> PutImage([FromRoute] string id, [FromBody] CourseChangeImageRequest courseChangeImage)
    {

        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
        
            await dbContext.Courses.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                .SetProperty(u => u.ImgUrl,  u => courseChangeImage.ImgUrl)
                .SetProperty(u => u.UpdatedAt, u => DateTime.Now)
            );
             

            var course = await dbContext.Courses.Select(
                c => new {
                    c.Id,
                    c.Name,
                    c.Active,
                    c.Description,
                    c.ImgUrl,
                    c.SubjectId,
                    c.CreatedAt,
                    c.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);
   
            return Ok(course);

        }
        catch(Exception e){
  
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] CourseCreateRequest courseCreateRequest)
    {
        try{
            
            await dbContext.Courses
            .AddAsync(
                new Course{
                    Name=courseCreateRequest.Name,
                    Description= courseCreateRequest.Description,
                    SubjectId= courseCreateRequest.SubjectId,
                    ImgUrl= null,
                    Price = courseCreateRequest.Price,
                    Active=false
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Courses.Select(
            c => new {
                c.Id,
                c.Name,
                c.Active,
                c.Description,
                c.ImgUrl,
                c.SubjectId,
                c.CreatedAt,
                c.UpdatedAt
            }).OrderBy(c=>c.CreatedAt).LastAsync();
 
            return Ok(Lastcourse);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
}
