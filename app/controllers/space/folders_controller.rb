class Space::FoldersController < Space::BaseController
  before_action :set_folder, only: %i[ show edit update destroy ]

  def index
    authorize [@space, Folder]
    if params[:direction].present?
      @folders = @space.folders.includes(:user).order("created_at #{params[:direction]}")
    else
      @folders = @space.folders.includes(:user).order("created_at desc")
    end

    fresh_when @folders + [@space]
  end

  def new
    authorize [@space, Folder]
    @space_folder = Folder.new
  end

  def create
    authorize [@space, Folder]
    @folder = AddFolderToSpace.call(@space, folder_params, params[:send_email]).result
    respond_to do |format|
      if @folder.errors.empty?
        format.html { redirect_to space_folders_path(@space), notice: "Folder was created successfully." }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace("folder_form", partial: "space/folders/form", locals: { space_folder: @folder, title: "Add New Folder", subtitle: "Threads are folders or discussion which can be added inside a space", space: @space, url: space_folders_path, method: "post" }) }
      end
    end
  end

  def edit
    authorize [@space, @folder]
    @space_folder = @folder
  end

  def show
    authorize [@space, @folder]
    @pagy, @surveys = pagy_nil_safe(params, @folder.survey_surveys.active.order("created_at desc"), items: 10)
    fresh_when [@folder] + [@space] + @surveys
  end

  def update
    authorize [@space, @folder]
    @folder = UpdateFolder.call(@space, @folder, current_user, params[:send_email], folder_params).result
    respond_to do |format|
      if @folder.errors.empty?
        format.html { redirect_to space_folder_path(@space, @folder), notice: "Folder was updated successfully." }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace("edit_folder_form", partial: "space/folders/edit_folder_form", locals: { folder: @folder, space: @space }) }
      end
    end
  end

  def destroy
    authorize [@space, @folder]
    @folder.destroy
    respond_to do |format|
      format.html { redirect_to space_folders_path(@space), notice: "Folder was removed successfully." }
    end
  end

  def folders
    authorize [Space, Folder]
    @space = Space.find(params[:space])
    @folders = @space.folders.order("title asc")
    respond_to do |format|
      if params[:folder_id]
        format.turbo_stream { render turbo_stream: turbo_stream.update("folder_id", partial: "space/folders/folders", locals: { space: @space, space_folders: @folders, target: "folder_id", selected_folder_id: params[:folder_id] }) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.update("folder_id", partial: "space/folders/folders", locals: { space: @space, space_folders: @folders, target: "folder_id" }) }
      end
    end
  end

  def change_folder
    authorize [Space, Folder]
    @survey = Survey::Survey.find(params[:id])
    @folder = Folder.find(params[:folder_id])

    respond_to do |format|
      if @survey.update(folder_id: @folder.id)
        @folder.touch
        flash[:notice] = "Folder was changed successfully."
        format.json { render json: { success: true, notice: flash[:notice], location: space_folder_path(@folder.space, @folder) } }
      else
        format.json { render json: { success: false }, status: :unprocessable_entity }
      end
    end
  end

  def set_folder
    @folder ||= Folder.find(params[:id])
  end

  def folder_params
    params.require(:folder).permit(:title, :body, :user_id, :space_id)
  end
end
