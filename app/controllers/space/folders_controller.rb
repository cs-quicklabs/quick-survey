class Space::FoldersController < Space::BaseController
  helper TrixAttachmentsHelper
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
    @folder = AddFolderToSpace.call(@space, Folder.new(folder_params), current_user, params[:draft], params[:send_email]).result

    respond_to do |format|
      if @folder.persisted?
        format.html { redirect_to space_folders_path(@space), notice: "Thread was created successfully." }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(Folder.new, partial: "space/folders/form", locals: { space_folder: @folder, title: "Add New Thread", subtitle: "Threads are folders or discussion which can be added inside a space", space: @space, url: space_folders_path, method: "post" }) }
      end
    end
  end

  def edit
    authorize [@space, @folder]
    @space_folder = @folder
  end

  def show
    authorize [@space, @folder]

    @comments = @folder.folder_comments.includes(:user).order(created_at: :asc)
    @comment = FolderComment.new

    fresh_when [@folder] + @comments + [@space]
  end

  def update
    authorize [@space, @folder]
    @folder = UpdateFolder.call(@space, @folder, current_user, params[:draft], params[:send_email], folder_params).result
    respond_to do |format|
      if @folder.errors.empty?
        format.html { redirect_to space_folders_path(@space), notice: "Thread was updated successfully." }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(@folder, partial: "space/folders/form", locals: { space_folder: @folder, title: "Edit Thread", subtitle: "Please update thread in existing space titled #{@folder.space.title}", space: @space, url: space_folder_path(@space, @folder), method: "patch" }) }
      end
    end
  end

  def destroy
    authorize [@space, @folder]
    @folder.destroy
    respond_to do |format|
      format.html { redirect_to space_folders_path(@space), notice: "Thread was removed successfully." }
    end
  end

  def set_folder
    @folder ||= Folder.find(params[:id])
  end

  def folder_params
    params.require(:folder).permit(:title, :body, :user_id, :space_id)
  end
end
