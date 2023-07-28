class SpacesController < ApplicationController
  include Pagy::Backend
  before_action :set_space, only: %i[ show edit update destroy pin unpin archive unarchive ]

  def index
    authorize :spaces
    @all_spaces = current_user.spaces.order(created_at: :desc)
    @pinned_spaces = current_user.pinned.order(created_at: :desc)
    @my_spaces = @all_spaces.select { |space| space.user_id == current_user.id && space.archive == false }
    @archived_spaces = @all_spaces.select { |space| space.archive == true }
    @shared_spaces = @all_spaces - @my_spaces - @archived_spaces

    render_partial("spaces/space", collection: @all_spaces, cached: true) if stale?(@all_spaces)
  end

  def new
    authorize :spaces
    @space = Space.new(user_id: current_user.id)
    @users = User.all
  end

  def edit
    authorize @space
    @users = User.all
    @space_users = @space.users.pluck(:user_id)
  end

  def create
    authorize :spaces

    @space = AddSpace.call(space_params, current_user, params[:space][:users]).result
    respond_to do |format|
      if @space.persisted?
        format.html { redirect_to space_folders_path(@space), notice: "Space was created successfully." }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(Space.new, partial: "spaces/form", locals: { space: @space, users: User.all, title: "Add New Space", subtitle: "Please fill in the details of your new space. A space is a groupd of similar threads.", url: spaces_path, method: "post", space_users: params[:space][:users] }) }
      end
    end
  end

  def update
    authorize @space
    @space = UpdateSpace.call(@space, current_user, params[:space][:users], space_params).result
    respond_to do |format|
      if @space.errors.empty?
        format.html { redirect_to space_folders_path(@space), notice: "Space was updated successfully." }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(@space, partial: "spaces/form", locals: { space: @space, users: User.all, title: "Edit Space", subtitle: "Please update the details of already existing space.", url: spaces_path, method: "post", space_users: params[:space][:users] }) }
      end
    end
  end

  def destroy
    authorize @space
    @space.destroy
    redirect_to spaces_path, status: 303, notice: "Space was removed successfully."
  end

  def pin
    authorize @space
    current_user.pinned_spaces.create(space: @space)
    respond_to do |format|
      format.html { redirect_to space_folders_path(@space), notice: "Space was pinned successfully." }
    end
  end

  def unpin
    authorize @space
    current_user.pinned.destroy @space
    redirect_to space_folders_path(@space), notice: "Space was unpinned successfully."
  end

  def archive
    authorize @space
    if ArchiveSpace.call(@space, current_user).result
      redirect_to space_folders_path(@space), notice: "Space was archived successfully."
    end
  end

  def unarchive
    authorize @space
    if UnarchiveSpace.call(@space, current_user).result
      redirect_to space_folders_path(@space), notice: "Space was unarchived successfully."
    end
  end

  private

  def set_space
    @space ||= Space.includes(:users).find(params[:id])
  end

  def space_params
    params.require(:space).permit(:title, :description, :user_id, :users)
  end
end
