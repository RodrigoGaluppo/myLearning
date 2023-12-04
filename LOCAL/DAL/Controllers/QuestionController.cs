using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public QuestionController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page,[FromQuery] int courseId,[FromQuery] string? search="" )
    {

        try{
            if(search == ""){
                var questions = await dbContext.Questions
                .OrderByDescending(c=> c.CreatedAt)
                .Skip((page - 1) * 10).Take(10)
                .Include(q=> q.Customer)
                .Where(c=>c.CourseId == courseId && c.Customer.Active == true)
                .Select(
                c => new {
                    c.Id,
                c.CustomerId,
                c.CourseId,
                c.Content,
                c.Title,
                c.CreatedAt,
                c.UpdatedAt,
                 Customer= new Customer{
                    Username=c.Customer.Username
                }
            }
            ).ToListAsync();

            return Ok(new {
                questions,
                count= Math.Ceiling((await dbContext.Questions
                .Where(q=> 
                   q.CourseId == courseId && q.Customer.Active == true
                ).CountAsync()) / 10.0)
            });

            }else{
                var questions = await dbContext.Questions
                .Where(q=> q.Title.Trim().ToLower().Contains(search.Trim().ToLower()) && q.CourseId == courseId && q.Customer.Active == true)
                .OrderByDescending(c=> c.CreatedAt)
                .Skip((page - 1) * 10).Take(10)
                .Include(q=> q.Customer)
                .Select(
                c => new {
                    c.Id,
                c.CustomerId,
                c.CourseId,
                c.Content,
                c.Title,
                c.CreatedAt,
                c.UpdatedAt,
                Customer= new Customer{
                    Username=c.Customer.Username
                }
            }
            ).ToListAsync();

            return Ok(new {
                questions,
                count= Math.Ceiling(( await dbContext.Questions
                .Where(q=> q.Title.Trim().ToLower().Contains(search.Trim().ToLower()) && q.CourseId == courseId && q.Customer.Active == true).CountAsync()) / 10.0)
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
            
            var question = await dbContext.Questions
            .Include(c=> c.Customer)
            .Include(q=> q.Comments)
            .ThenInclude(c => c.Customer)
            .Where(c => c.Customer.Active == true)
            .Select(
            c => new {
                c.Id,
                Username=c.Customer.Username,
                c.CourseId,
                c.Content,
                c.Title,
                Comments = c.Comments
                .Where(q=> q.Customer.Active == true)
                .Select(c => new {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    c.UpdatedAt,
                    CustomerUsername = c.Customer.Username // Include customer's first name
                }),
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);

            if(question == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(question);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string id)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Questions.Where(c=> c.Id.ToString() == id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id,[FromBody] QuestionCreateRequest questionCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            await dbContext.Questions.Where(c=> c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c => c.Title,  c => questionCreateRequest.Title)
                .SetProperty(c => c.Content,  c => questionCreateRequest.Content)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var subjectExists = await dbContext.Questions.Select(
            c => new {
                    c.Id,
                    c.CustomerId,
                    c.CourseId,
                    c.Content,
                    c.Title,
                    c.CreatedAt,
                    c.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);

            if(subjectExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(subjectExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] QuestionCreateRequest questionCreateRequest)
    {
        try{
            
            await dbContext.Questions
            .AddAsync(
                new Question{
                    CustomerId=questionCreateRequest.CustomerId,
                    CourseId=questionCreateRequest.CourseId,
                    Title=questionCreateRequest.Title,
                    Content=questionCreateRequest.Content
               
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Questions.Select(
            c => new {
                c.Id,
                c.CustomerId,
                c.CourseId,
                c.Content,
                c.Title,
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
