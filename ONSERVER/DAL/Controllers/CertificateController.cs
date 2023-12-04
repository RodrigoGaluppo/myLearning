using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class CertificateController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public CertificateController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page)
    {

        try{
            var chapters = await dbContext.Certificates.Skip((page - 1) * 10).OrderBy(c=> c.CreatedAt).Take(10).Select(
                c => new {
                c.CustomercourseId,
                c.Url,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(chapters);
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
            
            
            var courseExists = await dbContext.Certificates.Select(
            c => new {
                c.CustomercourseId,
                c.Url,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.CustomercourseId.ToString() == id);

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
            
            
            await dbContext.Certificates.Where(c => c.CustomercourseId.ToString() == id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] CertificateCreateRequest certificateCreateRequest)
    {
        try{
            
            await dbContext.Certificates.Where(c => c.CustomercourseId == certificateCreateRequest.CustomercourseId)
            .ExecuteDeleteAsync();

            await dbContext.Certificates
            .AddAsync(
                new Certificate{
                    CustomercourseId=certificateCreateRequest.CustomercourseId,
                    Url=certificateCreateRequest.Url
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Certificates.Select(
            c => new {
                c.CustomercourseId,
                c.Url,
                c.CreatedAt,
                c.UpdatedAt
            }).OrderBy(c=>c.CreatedAt).LastAsync();
 
            return Ok(Lastcourse);
        }
        catch(Exception e){
            System.Console.WriteLine(e);
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
}
