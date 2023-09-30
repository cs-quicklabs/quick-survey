class Screening::ResumeController < BaseController
  def index
    authorize [:screening, :resume]
    file = File.read("./json/resume.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
