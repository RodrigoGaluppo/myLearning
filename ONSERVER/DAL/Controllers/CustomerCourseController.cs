using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerCourseController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public CustomerCourseController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("list/{customerId}")]
    public async Task<IActionResult> List([FromQuery] int page, [FromRoute] string customerId)
    {

        try{
            var customerCourses = await dbContext.Customercourses
            .Where(c => c.CustomerId.ToString() == customerId.ToString())
            .Skip((page - 1) * 10)
            .OrderBy(c=> c.CreatedAt)
            .Take(10)
            .Select(
                c => new {
                c.Id,
                c.CustomerId,
                c.CourseId,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(customerCourses);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page)
    {

        try{
            var customerCourse = await dbContext.Customercourses.Skip((page - 1) * 10).OrderBy(c=> c.CreatedAt).Take(10).Select(
                c => new {
                c.Id,
                c.CustomerId,
                c.CourseId,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(customerCourse);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("GetByCustomerId")]
    public async Task<IActionResult> GetByCustomerId([FromQuery] string customerId, [FromQuery] string courseId)
    {
        try{
            
            if(customerId == null || courseId == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var courseExists = await dbContext.Customercourses.Select(
            c => new {
                c.Id,
                c.CustomerId,
                c.CourseId,
                c.CreatedAt,
                c.UpdatedAt,
               
            }).FirstOrDefaultAsync(c => c.CustomerId.ToString() == customerId && c.CourseId.ToString() == courseId);

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

    [HttpGet("{Id}")]
    public async Task<IActionResult> Get([FromRoute] string Id)
    {
        try{
            
            if(Id == null )
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var courseExists = await dbContext.Customercourses.Select(
            c => new {
                c.Id,
                c.CustomerId,
                c.CourseId,
                c.CreatedAt,
                c.UpdatedAt,
               
            }).FirstOrDefaultAsync(c => c.Id.ToString() == Id);

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

    

    [HttpDelete()]
    public async Task<IActionResult> Delete([FromQuery] string customerId, [FromQuery] string courseId)
    {
        try{
            
            if(courseId == null || customerId == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }

            await dbContext.Customercourses.Where(c => c.CustomerId.ToString() == customerId && c.CourseId.ToString() == courseId)
            .ExecuteDeleteAsync();

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] CustomerCourseCreateRequest customerCourseCreateRequest)
    {
        try{
            // verify if user already owns course
            var customerCourseExsists = await dbContext.Customercourses.FirstOrDefaultAsync(cc=>  
                cc.CustomerId == customerCourseCreateRequest.CustomerId &&
                cc.CourseId == customerCourseCreateRequest.CourseId
            );

            if(customerCourseExsists != null){
                return BadRequest(ApplicationError.userExists);
            }

            await dbContext.Customercourses
            .AddAsync(
                new Customercourse{
                    CustomerId=customerCourseCreateRequest.CustomerId,
                    CourseId=customerCourseCreateRequest.CourseId
                }
            );
            
            await dbContext.SaveChangesAsync();

            var newCustomerCourse  = await dbContext.Customercourses.FirstOrDefaultAsync(cc=>  
                cc.CustomerId == customerCourseCreateRequest.CustomerId &&
                cc.CourseId == customerCourseCreateRequest.CourseId
            );
 
            return Ok(newCustomerCourse);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
}
